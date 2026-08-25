// `createTimestamp` and `expireAt` are ISO 8601 strings throughout.

export enum ContentType {
  pdf_base64 = "pdf_base64",
  pdf_uri = "pdf_uri",
  raw_base64 = "raw_base64",
  raw_uri = "raw_uri",
}

/**
 * Not a closed set — PrintNode may return a state outside this enum, and `done`
 * only means the job reached the OS print queue:
 * docs/printnode-api.md#jobstate-is-not-a-closed-set
 */
export enum JobState {
  new = "new",
  sent_to_client = "sent_to_client",
  done = "done",
  expired = "expired",
  error = "error",
  deleted = "deleted",
}

type AccountId = number;
type ComputerId = number;
type PrinterId = number;
export type PrintJobId = number;

export type GetComputersResponse = Computer[];

export type RemoveComputersResponse = number[];

export type GetPrintersResponse = Printer[];

export type GetPrintJobsResponse = PrintJob[];

export type DeletePrintJobResponse = PrintJobId[];

export type GetPrintJobStateResponse = PrintJobStates[];

export type GetScalesResponse = Scale[];

/** One array per print job, holding every state that job has been in. */
type PrintJobStates = PrintJobState[];

export interface Computer {
  id: ComputerId;
  createTimestamp: string;
  hostname: string;
  /** Local IPv4 address. */
  inet: string;
  /** Local IPv6 address. */
  inet6: null | string;
  jre: null | string;
  name: string;
  state: "disconnected" | "connected";
  version: string;
}

export interface Printer {
  id: PrinterId;
  capabilities: PrinterCapabilities;
  computer: Computer;
  createTimestamp: string;
  default: boolean;
  description: string;
  name: string;
  state: "online" | "offline";
}

/**
 * Whatever the printer driver reports, so every array here is zero-length and
 * `printrate` is null when it reports nothing. `copies` is 1, not 0, when
 * multiple copies are unsupported.
 */
interface PrinterCapabilities {
  bins: string[];
  collate: boolean;
  color: boolean;
  copies: number;
  dpis: string[];
  duplex: boolean;
  /** `[[minWidth, minHeight], [maxWidth, maxHeight]]` in tenths of a millimetre. */
  extent: number[][];
  medias: string[];
  /**
   * The set of supported N values, where a print job takes a single one of
   * them: docs/printnode-api.md#capability-and-option-shapes
   */
  nup: number[];
  papers: Paper;
  printrate: null | PrintRate;
  supports_custom_paper_size: boolean;
}

interface PrintRate {
  unit: "ppm" | "ipm" | "lmp" | "cpm";
  rate: number;
}

/**
 * Keyed by paper name; `[width, height]` in tenths of a millimetre, or
 * `[null, null]` when the driver does not report the size.
 */
interface Paper {
  [key: string]: [number | null, number | null];
}
export interface CreatePrintJobOptions {
  printNodeOptions?: PrintNodePrintJobOptions;
  /**
   * Sent as `X-Idempotency-key`. A key PrintNode has already seen is ignored
   * silently, and keys recycle after 24 hours, so a key that can repeat inside
   * a day drops a legitimate reprint:
   * docs/printnode-api.md#idempotency-on-print-job-creation
   */
  idempotencyKey?: string;
}

interface PrintNodePrintJobOptions {
  /** Appears as the job name in the operating system's print queue. */
  title?: string;
  source?: string;
  options?: PrintJobOptions;
  /** Seconds a job that cannot print immediately is kept. Default 1,209,600 — 14 days. */
  expireAfter?: number;
  /** Whole-document re-sends, not driver copies: docs/printnode-api.md#qty-is-not-copies */
  qty?: number;
  authentication?: URIAuthentication;
}

/**
 * Ignored entirely when RAW printing. Most of these have to echo a value the
 * driver reported in `PrinterCapabilities`, and five behave differently per
 * platform — including the page-range syntax of `pages`:
 * docs/printnode-api.md#print-job-options
 */
interface PrintJobOptions {
  bin?: string;
  collate?: boolean;
  color?: boolean;
  copies?: number;
  dpi?: string;
  duplex?: "long-edge" | "short-edge" | "one-sided";
  fit_to_page?: boolean;
  media?: string;
  nup?: number;
  pages?: string;
  paper?: string;
  rotate?: 0 | 90 | 180 | 270;
}

/**
 * HTTP Basic or Digest credentials for the `content` URL under the `pdf_uri`
 * and `raw_uri` content types — the PrintNode Client does the download, so
 * these credentials travel to the client machine.
 */
interface URIAuthentication {
  type: "BasicAuth" | "DigestAuth";
  credentials: {
    user: string;
    pass: string;
  };
}

interface PrintJob {
  id: PrintJobId;
  printer: Printer;
  title: string;
  contentType: ContentType;
  source: string;
  expireAt: string | null;
  createTimestamp: string;
  state: JobState;
}

interface PrintJobState {
  printJobId: PrintJobId;
  state: JobState;
  message: string | null;
  /** Reserved for future use. */
  data: object | null;
  /** null unless the state came from the PrintNode Client. */
  clientVersion: string | null;
  /**
   * When the Client reported the state to PrintNode's server, or when the
   * server generated the state if no Client was involved.
   */
  createTimestamp: string;
  /** Milliseconds from the job's `new` state to this one. */
  age: number;
}

interface Scale {
  /**
   * `[mass, resolution]` in micrograms. The mass may be null, usually because
   * the reading was negative; the resolution is null when the scale does not
   * report one.
   */
  mass: [number | null, number | null];
  computerId: ComputerId;
  vendor: string;
  /** USB vendor id: http://www.usb.org/developers/vendor/ */
  vendorId: number;
  /** USB product id: http://www.linux-usb.org/usb.ids */
  productId: number;
  /** @example "USB1", "COM0" */
  port: string;
  /**
   * Manufacturer and description, unless renamed in the PrintNode Client. It is
   * therefore user-editable, and it is what the by-device scale endpoints put in
   * the path — a rename invalidates a stored device name.
   */
  deviceName: string | null;
  /**
   * Distinguishes scales sharing a deviceName on one computer: a connecting
   * scale takes the smallest unused value, counting from 0.
   */
  deviceNum: number | null;
  /** Reserved for future use. */
  deviceType: number | null;
  measurement: ScaleMeasurement;
  /** From the clock of the computer the scale is attached to, not PrintNode's. */
  clientReportedCreateTimestamp: string;
  /** Reserved for future use. */
  ntpOffset: number | null;
  /**
   * Milliseconds the reading has been held at PrintNode: 3ms to 10ms over a
   * websocket, much larger over the HTTP endpoints, and readings are deleted
   * after 45 seconds.
   */
  ageOfData: number;
}

/** Keyed by unit — `g`, `kg`, `lb` or `oz`. */
interface ScaleMeasurement {
  [key: string]: number;
}

export interface Account {
  id: AccountId;
  firstname: string;
  lastname: string;
  email: string;
  canCreateSubAccounts: boolean;
  creatorEmail: string | null;
  creatorRef: string | null;
  childAccounts: Account[];
  credits: number;
  numComputers: number;
  totalPrints: number;
  versions: string[];
  connected: ComputerId[];
  Tags: string[];
  state: "active" | "suspended" | "deleted";
  permissions: string[];
}
