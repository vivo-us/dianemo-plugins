export interface GraphQLResponse<T> {
  data: T;
  errors?: GraphQLError[];
  /**
   * Omitted on responses that fail before the query is priced — a malformed
   * document, or a token the shop rejects. Present on every executed query,
   * throttled ones included.
   */
  extensions?: {
    cost: {
      requestedQueryCost: number;
      /** Null until the query runs, so null on a throttled response. */
      actualQueryCost: number | null;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  /**
   * How Shopify distinguishes failures that look alike in the message:
   * `THROTTLED`, `MAX_COST_EXCEEDED`, `ACCESS_DENIED`. Absent on parser and
   * validation errors, which carry only a message.
   */
  extensions?: {
    code?: string;
    cost?: number;
    maxCost?: number;
    documentation?: string;
  };
}

export interface MultiRecord<T> {
  edges: {
    node: T;
  }[];
}

export interface GetManyResponse<T> extends MultiRecord<T> {
  pageInfo: PageInfo;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface GetManyBasicOptions {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}

export interface Metafield {
  id: string;
  jsonValue: string;
}

export interface ShopifyResponseUserError {
  code: string;
  field: string[];
  message: string;
}

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export type ShopifyRecordTypes =
  | "API_PERMISSION"
  | "COMPANY"
  | "COMPANY_LOCATION"
  | "PAYMENT_CUSTOMIZATION"
  | "VALIDATION"
  | "CUSTOMER"
  | "DELIVERY_CUSTOMIZATION"
  | "DRAFTORDER"
  | "GIFT_CARD_TRANSACTION"
  | "MARKET"
  | "CARTTRANSFORM"
  | "COLLECTION"
  | "MEDIA_IMAGE"
  | "PRODUCT"
  | "PRODUCTVARIANT"
  | "SELLING_PLAN"
  | "ARTICLE"
  | "BLOG"
  | "PAGE"
  | "FULFILLMENT_CONSTRAINT_RULE"
  | "ORDER_ROUTING_LOCATION_RULE"
  | "DISCOUNT"
  | "ORDER"
  | "LOCATION"
  | "SHOP";
