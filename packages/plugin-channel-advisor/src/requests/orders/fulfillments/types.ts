import { CAPagingQueryOptions, CAQueryOptions } from "../../types.js";

export type FulfillmentExpandOptions = "Items";

export type FulfillmentExpand = { options?: FulfillmentExpandOptions[] };

export type GetFulfillmentsOptions = CAPagingQueryOptions<
  keyof GetFulfillment,
  FulfillmentExpand
>;

export type GetFulfillmentOptions = CAQueryOptions<
  keyof GetFulfillment,
  FulfillmentExpand
>;

export type FulfillmentType = "Ship" | "Pickup" | "ShipToStore" | "Courier";

export type FulfillmentDeliveryStatus =
  | "NoChange"
  | "InTransit"
  | "ReadyForPickup"
  | "Complete"
  | "Canceled"
  | "ThirdPartyManaged"
  | "Confirmed"
  | "PickAndPack"
  | "LabelCreated"
  | "Held";

export type ExternalFulfillmentStatus =
  "Held" | "Failed" | "New" | "Pending" | "Sent" | "Processing" | "Complete";

export type LabelFormat = "PDF" | "ZPL";

export type FulfillmentItemSiteCommunicationStatus =
  | "Failed"
  | "Pending"
  | "InProgress"
  | "Complete"
  | "CompletedWithoutNotification";

export interface GetFulfillment {
  ID: number;
  ProfileID: number;
  OrderID: number;
  CreatedDateUtc: string;
  UpdatedDateUtc: string;
  Type: FulfillmentType;
  DeliveryStatus: FulfillmentDeliveryStatus;
  TrackingNumber: string | null;
  ReturnTrackingNumber: string | null;
  ShippingCarrier: string;
  ShippingClass: string;
  DistributionCenterID: number;
  ExternalFulfillmentCenterCode: string | null;
  ExternalFulfillmentStatus: ExternalFulfillmentStatus;
  ShippingCost: number;
  InsuranceCost: number;
  TaxCost: number;
  ShippedDateUtc: string | null;
  SellerFulfillmentID: string | null;
  HasShippingLabel: boolean;
  HasChannelPackingSlip: boolean;
  HasReturnLabel: boolean;
  EarliestDeliveryDateUtc: string | null;
  HasChannelReturnLabel: boolean;
  EarliestShipDateUtc: string | null;
  EstimatedDeliveryDateUtc: string | null;
  ExternalFulfillmentNumber: string | null;
  ExternalFulfillmentReferenceNumber: string | null;
  ShippingLabelRequestID: string | null;
  StagingLocation: string | null;
  SerialShippingContainerCode: string | null;
  EstimatedShipDateUtc: string | null;
  LabelFormat: LabelFormat | null;
  ReturnLabelFormat: LabelFormat | null;
  ChannelReturnLabelFormat: LabelFormat | null;
  TrackingUrl: string | null;
  Items?: GetFulfillmentItem[];
  // `GetOrder` from ../types.ts when expanded; `unknown` to break the cycle.
  Order?: unknown;
}

export interface CreateFulfillment {
  ProfileID: number;
  OrderID: number;
  Type?: FulfillmentType;
  DeliveryStatus?: FulfillmentDeliveryStatus;
  TrackingNumber?: string;
  ReturnTrackingNumber?: string;
  ShippingCarrier?: string;
  ShippingClass?: string;
  DistributionCenterID?: number;
  ShippingCost?: number;
  InsuranceCost?: number;
  TaxCost?: number;
  ShippedDateUtc?: string;
  SellerFulfillmentID?: string;
  ShippingLabelRequestID?: string;
  StagingLocation?: string;
  SerialShippingContainerCode?: string;
  TrackingUrl?: string;
  Items?: CreateFulfillmentItem[];
}

export interface UpdateFulfillment {
  ID: number;
  ProfileID?: number;
  Type?: FulfillmentType;
  DeliveryStatus?: FulfillmentDeliveryStatus;
  TrackingNumber?: string;
  ReturnTrackingNumber?: string;
  ShippingCarrier?: string;
  ShippingClass?: string;
  DistributionCenterID?: number;
  ShippingCost?: number;
  InsuranceCost?: number;
  TaxCost?: number;
  ShippedDateUtc?: string;
  SellerFulfillmentID?: string;
  StagingLocation?: string;
  SerialShippingContainerCode?: string;
  EstimatedShipDateUtc?: string;
  TrackingUrl?: string;
  Items?: UpdateFulfillmentItem[];
}

export interface GetFulfillmentItem {
  ID: number;
  ProfileID: number;
  FulfillmentID: number;
  OrderID: number;
  OrderItemID: number;
  Quantity: number;
  ProductID: number;
  SellerFulfillmentItemID: string | null;
  MarketplaceShippingStatus: FulfillmentItemSiteCommunicationStatus;
  DistributionCenterItemUnitCost: number | null;
  DistributionCenterShippingCost: number | null;
  DistributionCenterCalculatedItemUnitCost: number | null;
  DistributionCenterCalculatedShippingCost: number | null;
  Sku: string;
  ReferenceSku: string | null;
  ReferenceProductID: number | null;
  WarehouseLocation: string;
}

export interface CreateFulfillmentItem {
  ProfileID?: number;
  OrderID?: number;
  OrderItemID?: number;
  Quantity?: number;
  ProductID?: number;
  SellerFulfillmentItemID?: string;
  DistributionCenterItemUnitCost?: number;
  DistributionCenterShippingCost?: number;
  DistributionCenterCalculatedItemUnitCost?: number;
  DistributionCenterCalculatedShippingCost?: number;
  Sku: string;
}

export interface UpdateFulfillmentItem {
  ProfileID?: number;
  OrderItemID?: number;
  Quantity?: number;
  ProductID?: number;
  SellerFulfillmentItemID?: string;
  DistributionCenterItemUnitCost?: number;
  DistributionCenterShippingCost?: number;
  DistributionCenterCalculatedItemUnitCost?: number;
  DistributionCenterCalculatedShippingCost?: number;
}
