import {
  FulfillmentDeliveryStatus,
  FulfillmentType,
} from "../fulfillments/types.js";

export interface ShipOrderRequest {
  ShippedDateUtc?: string;
  TrackingNumber: string;
  ReturnTrackingNumber?: string;
  ShippingCarrier?: string;
  ShippingClass?: string;
  DistributionCenterID?: number;
  SellerFulfillmentID?: string;
  DeliveryStatus?: FulfillmentDeliveryStatus;
  FulfillmentType?: FulfillmentType;
  PreventMarketplaceCommunication?: boolean;
  TrackingUrl?: string;
  SerialShippingContainerCode?: string;
  Items?: ShipOrderItem[];
}

export interface ShipOrderItem {
  OrderItemID?: number;
  ProductID?: number;
  Sku?: string;
  Quantity: number;
  SellerFulfillmentItemID?: string;
}
