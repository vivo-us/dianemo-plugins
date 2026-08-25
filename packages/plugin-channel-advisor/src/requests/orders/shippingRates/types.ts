import { LabelFormat } from "../fulfillments/types.js";
import { CAQueryOptions } from "../../types.js";

export type GetPickupLabelOptions = CAQueryOptions<keyof PickupLabel>;

export type DeliveryConfirmation =
  | "Default"
  | "SignatureRequired"
  | "AdultSignaturedRequired"
  | "NoDeliveryConfirmation";

export type MeasurementUnit = "Inch" | "Centimeter";

export type WeightUnit = "Gram" | "Pound";

export type ExportReason = "MERCHANDISE" | "DOCUMENTS";

export interface PurchaseShippingLabelData {
  RateID: number;
  LabelFormat: LabelFormat;
  ShippingLabelRequestID?: string;
  DeliveryConfirmation?: DeliveryConfirmation;
}

export interface ShippingRate {
  Items: ShippingRateItem[];
  ShippingLabelPartnerAccountIDs: number[];
  PackageID?: number;
  ApplyDeliverByDate?: boolean;
  DeliverByDateUtc?: string;
  DeliveryConfirmation?: DeliveryConfirmation;
  DistributionCenterID?: number;
  InsuredAmount?: number;
  LabelFormat?: LabelFormat;
  ShipDateUtc?: string;
  MeasurementUnit?: MeasurementUnit;
  Length?: number;
  Width?: number;
  Height?: number;
  WeightUnit: WeightUnit;
  Weight: number;
  PurchaseCheapestRate?: boolean;
  ShippingLabelRequestID?: number;
  IncludeCustoms?: boolean;
  ExportReason?: ExportReason;
  CertificateNumber?: string;
  CustomsComments?: string;
  EelPfc?: string;
  FromCustomsReference?: string;
  ImporterCustomsReference?: string;
  InsuredNumber?: string;
  LicenseNumber?: string;
  ManufacturedCountryCode?: string;
  SourceCompanyName?: string;
  SourceTitle?: string;
  SourceFirstName?: string;
  SourceLastName?: string;
  SourceAddressLine1?: string;
  SourceAddressLine2?: string;
  SourceCity?: string;
  SourceStateOrProvince?: string;
  SourcePostalCode?: string;
  SourceCountryCode?: string;
  SourceEmailAddress?: string;
  SourcePhoneNumber?: string;
  DestinationCompanyName?: string;
  DestinationTitle?: string;
  DestinationFirstName?: string;
  DestinationLastName?: string;
  DestinationAddressLine1?: string;
  DestinationAddressLine2?: string;
  DestinationCity?: string;
  DestinationStateOrProvince?: string;
  DestinationPostalCode?: string;
  DestinationCountryCode?: string;
  DestinationEmailAddress?: string;
  DestinationPhoneNumber?: string;
  IsCommercialAddress?: boolean;
}

export interface ShippingRateItem {
  FulfillmentItemID?: number;
  OrderItemID?: number;
  Sku: string;
  Quantity: number;
  UnitWeight?: number;
  Description: string;
}

export interface PickupLabel {
  $id: string;
  LabelContent: string;
  LabelContentType: string;
  FulfillmentID: number;
  InvoiceID: number;
  PackageID: string;
}
