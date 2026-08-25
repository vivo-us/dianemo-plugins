import { WalmartBoolean, WalmartError, WalmartPrice } from "../types.js";

// Shapes follow Walmart's PRICE_AND_PROMOTION feed specification.

export interface WalmartPriceFeed {
  MPItemFeedHeader?: {
    businessUnit?: string;
    version?: string;
    locale?: string;
  };
  MPItem: WalmartPriceFeedItem[];
}

export interface WalmartPriceFeedItem {
  "Promo&Discount": {
    sku?: string;
    price?: number;
    msrp?: number;
  };
}

// PUT /v3/price - Update price for a single item
export interface UpdatePriceData {
  offerId?: string;
  sku: string;
  replaceAll?: WalmartBoolean;
  pricing: {
    effectiveDate?: string;
    expirationDate?: string;
    promoId?: string;
    processMode?: "UPSERT" | "DELETE";
    currentPriceType: "BASE" | "REDUCED" | "CLEARANCE";
    currentPrice: WalmartPrice;
    comparisonPriceType?: "BASE";
    comparisonPrice?: WalmartPrice;
    priceDisplayCodes?: "CART" | "CHECKOUT";
  };
  definitions?: object;
}

export interface UpdatePriceResponse {
  errors?: WalmartError[];
  statusCode?: number;
  mart?: string;
  sku?: string;
  message?: string;
}
