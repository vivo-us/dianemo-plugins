import { ShopifyRecordTypes } from "../types.js";

/**
 * Spelled out rather than derived. Splitting on `_` and PascalCasing each word is
 * right for `COMPANY_LOCATION` → `CompanyLocation` and wrong for the three record
 * types Shopify writes as one word: `PRODUCTVARIANT` became `Productvariant`, so
 * every variant GID named a type that does not exist. No transformation can
 * recover a word boundary that is not in the input.
 */
const GRAPHQL_TYPE_NAMES: Record<ShopifyRecordTypes, string> = {
  API_PERMISSION: "ApiPermission",
  ARTICLE: "Article",
  BLOG: "Blog",
  // Single-word record types whose GraphQL names are two words.
  CARTTRANSFORM: "CartTransform",
  DRAFTORDER: "DraftOrder",
  PRODUCTVARIANT: "ProductVariant",
  COLLECTION: "Collection",
  COMPANY: "Company",
  COMPANY_LOCATION: "CompanyLocation",
  CUSTOMER: "Customer",
  DELIVERY_CUSTOMIZATION: "DeliveryCustomization",
  DISCOUNT: "Discount",
  FULFILLMENT_CONSTRAINT_RULE: "FulfillmentConstraintRule",
  GIFT_CARD_TRANSACTION: "GiftCardTransaction",
  LOCATION: "Location",
  MARKET: "Market",
  MEDIA_IMAGE: "MediaImage",
  ORDER: "Order",
  ORDER_ROUTING_LOCATION_RULE: "OrderRoutingLocationRule",
  PAGE: "Page",
  PAYMENT_CUSTOMIZATION: "PaymentCustomization",
  PRODUCT: "Product",
  SELLING_PLAN: "SellingPlan",
  SHOP: "Shop",
  VALIDATION: "Validation",
};

/** Used for a GID's middle segment and for an inline fragment's type. */
export const graphQLTypeName = (type: ShopifyRecordTypes): string =>
  GRAPHQL_TYPE_NAMES[type];
