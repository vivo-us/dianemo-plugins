import { ShopifyResponseUserError } from "../types.js";

type ShopifyBulkOperationStatus =
  | "CANCELED"
  | "CANCELING"
  | "COMPLETED"
  | "CREATED"
  | "EXPIRED"
  | "FAILED"
  | "RUNNING";

export interface ShopifyCreateBulkOperationResponse {
  bulkOperationRunQuery: {
    /**
     * Null whenever `userErrors` is populated — a malformed bulk query, or a
     * second operation started while one runs, which Shopify allows one of.
     */
    bulkOperation: {
      id: string;
      status: ShopifyBulkOperationStatus;
    } | null;
    userErrors: ShopifyResponseUserError[];
  };
}

export interface ShopifyBulkOperationGetStatusResponse {
  /** Null when the id resolves to nothing, expiry included. */
  node: {
    id: string;
    status: ShopifyBulkOperationStatus;
    errorCode: string | null;
    createdAt: string;
    completedAt: string | null;
    objectCount: string;
    fileSize: string | null;
    url: string | null;
  } | null;
}
