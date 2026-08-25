export type WalmartFeedType =
  "inventory" | "MP_INVENTORY" | "PRICE_AND_PROMOTION";

export type WalmartFeedStatus =
  "RECEIVED" | "INPROGRESS" | "PROCESSED" | "ERROR";

export interface GetFeedStatusParams {
  includeDetails?: "true" | "false";
  offset?: string;
  limit?: string;
}

export interface WalmartFeedStatusResponse {
  feedId: string;
  feedType: WalmartFeedType;
  partnerId?: string;
  itemsReceived?: number;
  itemsSucceeded?: number;
  itemsFailed?: number;
  itemsProcessing?: number;
  offset?: number;
  limit?: number;
  feedStatus: WalmartFeedStatus;
  feedDate?: number;
  modifiedDtm?: number;
  itemDetails?: {
    itemIngestionStatus: WalmartItemIngestionStatus[];
  };
}

export interface WalmartItemIngestionStatus {
  martId?: number;
  sku: string;
  wpid?: string;
  index?: number;
  ingestionStatus: "SUCCESS" | "DATA_ERROR" | "SYSTEM_ERROR" | "TIMEOUT_ERROR";
  ingestionErrors?: {
    ingestionError: WalmartIngestionError[];
  };
}

export interface WalmartIngestionError {
  type: string;
  code?: string;
  field?: string;
  description?: string;
}

export interface WalmartFeedResponse {
  feedId: string;
  additionalAttributes?: {
    [key: string]: string;
  };
  errors?: WalmartFeedError[];
}

export interface WalmartFeedError {
  code: string;
  field?: string;
  description?: string;
  info?: string;
  severity?: "INFO" | "WARN" | "ERROR";
  category?: "APPLICATION" | "SYSTEM" | "REQUEST" | "DATA";
}
