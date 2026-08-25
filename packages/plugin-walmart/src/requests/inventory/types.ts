import { WalmartBaseError } from "../types.js";

// Shapes follow Walmart's MP_INVENTORY feed specification v1.5.

export interface WalmartInventoryQuantity {
  unit: "EACH";
  amount: number;
}

export interface WalmartMultiNodeInventoryFeed {
  inventoryHeader: {
    version: string;
  };
  inventory: WalmartInventoryItem[];
}

export interface WalmartInventoryItem {
  sku: string;
  shipNodes: WalmartShipNodeInventory[];
}

export interface WalmartShipNodeInventory {
  shipNode: string;
  quantity: WalmartInventoryQuantity;
}

// GET /v3/inventory - Single SKU inventory at default/specific ship node
export interface GetInventoryParams {
  sku: string;
  shipNode?: string;
}

export interface InventoryResponse {
  sku: string;
  quantity: WalmartInventoryQuantity;
  fulfillmentLagTime?: number;
}

// PUT /v3/inventory - Update single SKU inventory
export interface UpdateInventoryData {
  sku: string;
  quantity: WalmartInventoryQuantity;
  fulfillmentLagTime?: number;
}

export interface UpdateInventoryParams {
  sku: string;
  shipNode?: string;
}

// GET /v3/inventories/{sku} - Multi-node inventory for single SKU
export interface GetMultiNodeInventoryParams {
  shipNode?: string;
}

export interface MultiNodeInventoryResponse {
  sku: string;
  nodes: NodeInventory[];
}

export interface NodeInventory {
  shipNode: string;
  inputQty: WalmartInventoryQuantity;
  availToSellQty?: WalmartInventoryQuantity;
  reservedQty?: WalmartInventoryQuantity;
  errors?: WalmartBaseError[];
  inventoryAvailableDate?: string;
}

// PUT /v3/inventories/{sku} - Update multi-node inventory for single SKU
export interface UpdateMultiNodeInventoryData {
  inventories: {
    nodes: {
      shipNode: string;
      inputQty: WalmartInventoryQuantity;
      inventoryAvailableDate?: string;
    }[];
  };
}

export interface UpdateMultiNodeInventoryResponse {
  sku: string;
  nodes: {
    shipNode?: string;
    status?: string;
    errors?: WalmartBaseError[];
  }[];
}

// GET /v3/inventories - All inventory for all SKUs and ship nodes (paginated)
export interface GetAllInventoryParams {
  limit?: string;
  nextCursor?: string;
}

export interface AllInventoryResponse {
  meta?: {
    totalCount?: number;
    nextCursor?: string;
  };
  elements?: {
    // An array: this endpoint pages over every SKU and ship node via
    // `meta.nextCursor`, so a page carries one entry per SKU rather than the
    // one entry a bare object would allow.
    inventories: {
      sku: string;
      nodes: {
        shipNode?: string;
        inputQty?: WalmartInventoryQuantity;
        availToSellQty?: WalmartInventoryQuantity;
        reservedQty?: WalmartInventoryQuantity;
      }[];
    }[];
  };
}

// GET /v3/wfs/inventory - WFS inventory details
export interface GetWFSInventoryParams {
  sku?: string;
  gtin?: string;
  limit?: string;
  offset?: string;
}

export interface WFSInventoryResponse {
  headers?: {
    limit?: number;
    offset?: number;
    totalCount?: number;
  };
  payload?: {
    inventory?: WFSInventoryItem[];
  };
}

export interface WFSInventoryItem {
  itemInformation?: {
    itemName?: string;
    gtin?: string;
    sku?: string;
    itemID?: string;
    offerID?: string;
    brand?: string;
    itemCondition?: string;
  };
  inventoryData?: {
    publishingStatus?:
      | "Published"
      | "Unpublished"
      | "Processing"
      | "Stage"
      | "Error"
      | "WFS Ineligible";
    itemLifecycle?: "Active" | "Retired" | "Archived";
    stockStatus?: "Out-of-stock" | "In-stock" | "At-risk";
    availableUnits?: number;
    inboundUnits?: number;
    unavailableUnits?: {
      inventoryReviewUnits?: number;
      inventoryMovementUnits?: number;
    };
    onhandUnits?: number;
    inventoryAge?: {
      "0To90days"?: number;
      "91To180days"?: number;
      "181To270days"?: number;
      "271To365days"?: number;
      "366PlusDays"?: number;
    };
    firstInStockDate?: string;
  };
  inventoryInsights?: {
    salesForecastWeek1to4?: number;
    salesForecastWeek5to8?: number;
    salesForecastWeek9to12?: number;
    sellThroughRate?: number;
    daysOfSupply?: string;
    outOfStockDate?: string;
    suggestedUnits?: number;
    surplusUnits?: number;
  };
}
