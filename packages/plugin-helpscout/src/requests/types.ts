export type HelpScoutConversationType = "chat" | "email" | "phone";

export type HelpScoutConversationStatus =
  "active" | "all" | "closed" | "open" | "pending" | "spam";

export type HelpScoutConversationState = "deleted" | "draft" | "published";

export type HelpScoutSourceType =
  | "api"
  | "beacon"
  | "channel"
  | "chat"
  | "consumer"
  | "coreapi"
  | "csv"
  | "cvs"
  | "desk"
  | "docs"
  | "email"
  | "emailfwd"
  | "heymarket"
  | "internal"
  | "jira"
  | "manual"
  | "mobile"
  | "notification"
  | "orchestration"
  | "support"
  | "unknown"
  | "uservoice"
  | "web"
  | "workflows"
  | "zendesk";

export type HelpScoutSourceVia = "user" | "customer";

export interface HelpScoutUser {
  id: number;
  type: string;
  first?: string;
  last?: string;
  email: string;
  photoUrl?: string;
}

export interface HelpScoutCustomer {
  id: number;
  type: string;
  first?: string;
  last?: string;
  email: string;
}

export interface HelpScoutTag {
  id: number;
  color: string;
  tag: string;
}

export interface HelpScoutCustomerWaitingSince {
  time: string;
  friendly: string;
}

export interface HelpScoutSource {
  type: HelpScoutSourceType;
  via: HelpScoutSourceVia;
}

export interface HelpScoutSnooze {
  snoozedBy: number;
  snoozedUntil: string;
  unsnoozeOnCustomerReply: boolean;
}

export interface HelpScoutNextEvent {
  time: string;
  eventType: string;
}

export interface HelpScoutCustomField {
  id: number;
  name: string;
  value: string;
  text: string;
}

export interface HelpScoutLink {
  href: string;
}

export interface HelpScoutLinks {
  self: HelpScoutLink;
  mailbox: HelpScoutLink;
  primaryCustomer: HelpScoutLink;
  createdByCustomer?: HelpScoutLink;
  closedBy?: HelpScoutLink;
  threads: HelpScoutLink;
  assignee?: HelpScoutLink;
  web: HelpScoutLink;
}

export type HelpScoutThreadType =
  | "beaconchat"
  | "chat"
  | "customer"
  | "forwardchild"
  | "forwardparent"
  | "lineitem"
  | "message"
  | "note"
  | "phone";

export type HelpScoutThreadStatus = "active" | "closed" | "pending" | "spam";

export type HelpScoutThreadState = "draft" | "hidden" | "published" | "review";

export type HelpScoutAttachmentState = "valid" | "virus";

export type HelpScoutRatingValue = "great" | "not_good" | "okay";

export interface HelpScoutAction {
  type: string;
  text: string;
  associatedEntities: Record<string, unknown>;
}

export interface HelpScoutRating {
  customerId: number;
  rating: HelpScoutRatingValue;
  comments: string;
}

export interface HelpScoutScheduled {
  scheduledBy: number;
  createdAt: string;
  scheduledFor: string;
  unscheduleOnCustomerReply: boolean;
}

export interface HelpScoutAttachment {
  id: number;
  filename: string;
  mimeType: string;
  width?: number;
  height?: number;
  size: number;
  state: HelpScoutAttachmentState;
  _links: {
    self: HelpScoutLink;
    data: HelpScoutLink;
  };
}

export interface HelpScoutThreadEmbedded {
  attachments: HelpScoutAttachment[];
}

export interface HelpScoutThread {
  id: number;
  type: HelpScoutThreadType;
  status: HelpScoutThreadStatus;
  state: HelpScoutThreadState;
  action?: HelpScoutAction;
  body: string;
  source: HelpScoutSource;
  customer?: HelpScoutCustomer;
  createdBy: HelpScoutUser;
  assignedTo?: HelpScoutUser;
  savedReplyId?: number;
  to: string[];
  cc: string[];
  bcc: string[];
  createdAt: string;
  openedAt?: string;
  rating?: HelpScoutRating;
  scheduled?: HelpScoutScheduled;
  _embedded: HelpScoutThreadEmbedded;
}

export interface HelpScoutEmbedded {
  /**
   * **Truncated by Help Scout, and not paginated** — the response says nothing
   * about what was dropped. Check the length against
   * `HelpScoutConversationBase.threads`, the real count. See
   * docs/helpscout-api.md#embedded-threads-are-truncated
   */
  threads: HelpScoutThread[];
}

export interface HelpScoutPage {
  size: number;
  totalElements: number;
  totalPages: number;
  /** 1-based. */
  number: number;
}

export interface HelpScoutPageLinks {
  self: HelpScoutLink;
  first: HelpScoutLink;
  last: HelpScoutLink;
  next?: HelpScoutLink;
  previous?: HelpScoutLink;
  page: HelpScoutLink;
}

/** Complete, unlike the embedded copy: page while `page.number < page.totalPages`. */
export interface HelpScoutConversationThreads {
  _embedded: HelpScoutEmbeddedThreads;
  _links: HelpScoutPageLinks;
  page: HelpScoutPage;
}

export interface HelpScoutEmbeddedThreads {
  threads: HelpScoutThread[];
}

export interface HelpScoutConversationBase {
  id: number;
  number: number;
  threads: number;
  type: HelpScoutConversationType;
  folderId: number;
  status: HelpScoutConversationStatus;
  state: HelpScoutConversationState;
  subject: string;
  preview: string;
  mailboxId: number;
  assignee?: HelpScoutUser;
  createdBy: HelpScoutUser;
  createdAt: string;
  closedBy?: number;
  closedByUser?: HelpScoutUser;
  closedAt?: string;
  userUpdatedAt: string;
  customerWaitingSince?: HelpScoutCustomerWaitingSince;
  source: HelpScoutSource;
  tags: HelpScoutTag[];
  cc: string[];
  bcc: string[];
  primaryCustomer: HelpScoutCustomer;
  snooze?: HelpScoutSnooze;
  nextEvent?: HelpScoutNextEvent;
  customFields: HelpScoutCustomField[];
  _links: HelpScoutLinks;
}

/** `_embedded.threads` is truncated — see {@link HelpScoutEmbedded.threads}. */
export interface HelpScoutConversationWithThreads extends HelpScoutConversationBase {
  _embedded: HelpScoutEmbedded;
}

export interface HelpScoutConversationWithoutThreads extends HelpScoutConversationBase {
  _embedded?: never;
}
