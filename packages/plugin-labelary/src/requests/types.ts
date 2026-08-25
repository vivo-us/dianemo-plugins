type FileFormat =
  | "image/png"
  | "application/json"
  | "application/ipl"
  | "application/epl"
  | "application/dpl"
  | "application/pdf";

type DPI = 6 | 8 | 12 | 24;

export interface LabelaryData {
  /** The raw ZPL to render, as a string. Labelary does not accept base64. */
  label: string;
  format: FileFormat;
  dpi: DPI; // dots per *millimetre*, despite the name — the URL segment is `dpmm`
  width: number; // inches
  height: number; // inches
  /**
   * Zero-based, for a ZPL string holding more than one label. With
   * `format: "application/pdf"`, omitting it returns **every** label as a
   * multi-page PDF — the only way to get a whole batch in one call.
   */
  index?: number;
}
