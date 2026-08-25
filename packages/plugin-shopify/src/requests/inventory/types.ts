import { GetManyResponse, ShopifyResponseUserError } from "../types.js";

export type ShopifyProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface ShopifyInventoryItem {
  id: string;
  sku: string;
  variant: {
    id: string;
    product: {
      id: string;
      status: ShopifyProductStatus;
    };
  };
}
export interface GetManyInventoryItemsResponse {
  inventoryItems: GetManyResponse<ShopifyInventoryItem>;
}

export interface ShopifySetQuantitiesInput {
  name: string;
  reason: string;
  referenceDocumentUri?: string;
  quantities: {
    inventoryItemId: string;
    locationId: string;
    quantity: number;
    compareQuantity?: number;
  }[];
  ignoreCompareQuantity?: boolean;
}
export interface ShopifySetQuantitiesResponse {
  inventorySetQuantities: {
    inventoryAdjustmentGroup: {
      createdAt: string;
      reason: string;
      referenceDocumentUri: string | null;
      changes: {
        name: string;
        delta: number;
      }[];
    };
    userErrors: ShopifyResponseUserError[];
  };
}
