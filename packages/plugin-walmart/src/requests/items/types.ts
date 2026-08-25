import { WalmartBoolean, WalmartPrice } from "../types.js";

export interface GetItemsParams {
  nextCursor?: string;
  sku?: string;
  gtin?: string;
  offset?: number;
  limit?: number;
  lifecycleStatus?: "ACTIVE" | "ARCHIVED" | "RETIRED";
  publishedStatus?: "PUBLISHED" | "UNPUBLISHED";
  variantGroupId?: string;
  condition?:
    | "New"
    | "New without box"
    | "New without tags"
    | "Restored Premium"
    | "Restored"
    | "Remanufactured"
    | "Open Box"
    | "Pre-Owned: Like New"
    | "Pre-Owned: Good"
    | "Pre-Owned: Fair"
    | "New with defects";
  availability?: "In_stock" | "Out_of_stock" | "Preorder";
  showDuplicateItemInfo?: WalmartBoolean;
  includeCustomerFavoritesStatus?: WalmartBoolean;
}

export interface ItemsResponse {
  ItemResponse: ItemResponseItem[];
  additionalAttributes?: AdditionalAttributes[];
  totalItems?: number;
  nextCursor?: string;
}

export interface ItemResponseItem {
  mart?: "WALMART_US" | "WALMART_CA" | "ASDA_GM" | "WALMART_MEXICO";
  sku: string;
  condition?: string;
  availability?: string;
  wpid?: string;
  upc?: string;
  gtin?: string;
  productName?: string;
  shelf?: string;
  productType?: string;
  price?: WalmartPrice;
  publishedStatus?:
    | "PUBLISHED"
    | "READY_TO_PUBLISH"
    | "IN_PROGRESS"
    | "UNPUBLISHED"
    | "STAGE"
    | "SYSTEM_PROBLEM";
  additionalAttributes?: AdditionalAttributes;
  unpublishedReasons?: {
    reason?: string[];
  };
  lifecycleStatus?: "ACTIVE" | "ARCHIVED" | "RETIRED";
  variantGroupId?: string;
  variantGroupInfo?: ItemResponseVariantGroupInfo;
  isCustomerFavorite?: boolean;
  isDuplicate?: boolean;
  duplicateItemInfo?: ItemResponseDuplicateItemInfo;
}

export interface AdditionalAttributes {
  name: string;
  type:
    | "LOCALIZABLE_TEXT"
    | "STRING"
    | "BOOLEAN"
    | "INTEGER"
    | "DECIMAL"
    | "DATE"
    | "TIMESTAMP";
  isVariant?: boolean;
  variantResourceType?: string;
  value: {
    value: string;
    group?: string;
    source?: string;
    rank?: number;
    isVariant?: boolean;
  }[];
}

export interface ItemResponseVariantGroupInfo {
  isPrimary?: boolean;
  primary?: boolean;
  groupingAttributes?: {
    name?: string;
    value?: string;
  };
}

export interface ItemResponseDuplicateItemInfo {
  status?: string;
  lastUpdatedDate?: string;
  identifiedDate?: string;
  destinationItem?: {
    mart?: string;
    wpid?: string;
    gtin?: string;
    upc?: string;
    itemId?: string;
    productName?: string;
    productType?: string;
  };
}
