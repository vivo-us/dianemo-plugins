type Status = "ACCEPTED" | "VALID" | "INVALID";

export interface ListingItemPatchRequest {
  productType: string;
  patches: ListingItemPatch[];
}

interface ListingItemPatch {
  op: "add" | "replace" | "delete";
  path: string;
  value?: object[];
}

export interface ListingItemPatchResponse {
  sku: string;
  status: Status;
  submissionId: string;
  issues: Issue[];
  identifiers?: Identifier[];
}

interface Issue {
  code: string;
  message: string;
  severity: "ERROR" | "WARNING" | "INFO";
  attributeNames?: string[];
  categories: string[];
  enforcements?: {
    actions: {
      actions:
        | "LISTING_SUPPRESSED"
        | "ATTRIBUTE_SUPPRESSED"
        | "CATALOG_ITEM_REMOVED"
        | "SEARCH_SUPPRESSED";
    }[];
    exemption: {
      status: Status;
      expiryDate?: string;
    };
  };
}

interface Identifier {
  marketplaceId?: string;
  asin?: string;
}

export interface GetListingResponse {
  sku: string;
  summaries?: ListingSummary[];
  attributes?: object;
  issues?: Issue[];
  offers?: Offer[];
  fulfillmentAvailability?: FulfillmentAvailability[];
  procurement?: Procurement[];
  relationships?: ItemRelationships[];
  productTypes?: ItemProductTypes[];
}

export interface ItemRelationships {
  marketplaceId: string;
  relationships: ItemRelationship[];
}

export interface ItemRelationship {
  childSkus?: string[];
  parentSkus?: string[];
  variationTheme?: ItemVariationTheme;
  type: "VARIATION" | "PACKAGE_HIERARCHY";
}

export interface ItemVariationTheme {
  attributes?: string[];
  theme?: string;
}

export interface ItemProductTypes {
  marketplaceId: string;
  productTypes: string[];
}

interface ListingSummary {
  marketplaceId: string;
  asin: string;
  productType: string;
  conditionType?:
    | "new_new"
    | "new_open_box"
    | "new_oem"
    | "refurbished_refurbished"
    | "used_like_new"
    | "used_very_good"
    | "used_good"
    | "used_acceptable"
    | "collectible_like_new"
    | "collectible_very_good"
    | "collectible_good"
    | "collectible_acceptable"
    | "club_club";
  status: ("BUYABLE" | "DISCOVERABLE")[];
  fnSku?: string;
  itemName: string;
  createdDate: string;
  lastUpdatedDate: string;
  mainImage?: {
    link: string;
    height: number;
    width: number;
  };
}

export interface Offer {
  marketplaceId: string;
  offerType: "B2C" | "B2B";
  price: {
    currencyCode: string;
    amount: number;
  };
  points?: {
    pointsNumber: number;
  };
}

export interface FulfillmentAvailability {
  fulfillmentChannelCode: string;
  quantity?: number;
}

interface Procurement {
  costPrice: {
    currencyCode: string;
    amount: number;
  };
}

export type IdentifiersType =
  "ASIN" | "EAN" | "FNSKU" | "GTIN" | "ISBN" | "JAN" | "MINSAN" | "SKU" | "UPC";

export type IssueSeverity = "WARNING" | "ERROR";

export type ListingStatus = "BUYABLE" | "DISCOVERABLE";

export type SortBy =
  "sku" | "createdDate" | "lastUpdatedDate" | "status" | "itemName";

export type SortOrder = "ASC" | "DESC";

export type IncludedData =
  | "summaries"
  | "attributes"
  | "issues"
  | "offers"
  | "fulfillmentAvailability"
  | "procurement"
  | "relationships"
  | "productTypes";

export interface SearchListingsItemsParams {
  marketplaceIds: string;
  issueLocale?: string;
  includedData?: IncludedData[];
  identifiers?: string[];
  identifiersType?: IdentifiersType;
  variationParentSku?: string;
  packageHierarchySku?: string;
  createdAfter?: string;
  createdBefore?: string;
  lastUpdatedAfter?: string;
  lastUpdatedBefore?: string;
  withIssueSeverity?: IssueSeverity[];
  withStatus?: ListingStatus[];
  withoutStatus?: ListingStatus[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  pageSize?: number;
  pageToken?: string;
}

export interface Pagination {
  nextToken?: string;
  previousToken?: string;
}

export interface SearchListingsItemsResponse {
  numberOfResults: number;
  pagination?: Pagination;
  items: GetListingResponse[];
}
