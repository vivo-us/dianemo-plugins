import { WayfairGraphQLData } from "../types.js";

export interface WayfairPurchaseOrderProduct {
  partNumber: string;
  quantity: number;
  price: number;
}

export interface WayfairPurchaseOrder {
  poNumber: string;
  poDate: string;
  estimatedShipDate: string;
  customerName: string;
  orderType: string;
  products: WayfairPurchaseOrderProduct[];
}

export interface WayfairPurchaseOrdersData {
  purchaseOrders: WayfairPurchaseOrder[];
}

export type WayfairPurchaseOrdersResponse =
  WayfairGraphQLData<WayfairPurchaseOrdersData>;
