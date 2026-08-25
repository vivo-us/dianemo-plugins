import type {
  UspsLabelAddress,
  UspsLabelToAddress,
  UspsImageInfo,
} from "../types.js";

export type UspsMailClass =
  | "USPS_GROUND_ADVANTAGE"
  | "PRIORITY_MAIL"
  | "PRIORITY_MAIL_EXPRESS"
  | "PARCEL_SELECT"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "BOUND_PRINTED_MATTER"
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "USPS_CONNECT_LOCAL"
  | "USPS_CONNECT_REGIONAL"
  | "USPS_CONNECT_MAIL";

export type UspsProcessingCategory =
  | "LETTERS"
  | "FLATS"
  | "MACHINABLE"
  | "IRREGULAR"
  | "NON_MACHINABLE"
  | "NONSTANDARD";

export interface UspsPackageDescription {
  mailClass: UspsMailClass;
  processingCategory: UspsProcessingCategory;
  rateIndicator: string;
  destinationEntryFacilityType:
    | "NONE"
    | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
    | "DESTINATION_SECTIONAL_CENTER_FACILITY"
    | "DESTINATION_DELIVERY_UNIT"
    | "DESTINATION_SERVICE_HUB"
    | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";
  weight: number;
  length: number;
  width: number;
  height: number;
  mailingDate: string;
  customerReference?: Array<{
    referenceNumber: string;
  }>;
  extraServices?: Array<{ extraServiceCode: number; value?: number }>;
  girth?: number;
  inductionZIPCode?: string;
  carrierRelease?: boolean;
  physicalSignatureRequired?: boolean;
  packageOptions?: {
    immediateManifest?: boolean;
    contentType?: string;
    nonDeliveryOption?: string;
  };
}

export interface UspsCreateLabelRequest {
  toAddress: UspsLabelToAddress;
  fromAddress: UspsLabelAddress;
  senderAddress?: UspsLabelAddress;
  returnAddress?: UspsLabelAddress;
  packageDescription: UspsPackageDescription;
  imageInfo?: UspsImageInfo;
  customsForm?: UspsCustomsForm;
}

export interface UspsCustomsForm {
  customsContentType:
    | "MERCHANDISE"
    | "GIFT"
    | "DOCUMENT"
    | "COMMERCIAL_SAMPLE"
    | "RETURNED_GOODS"
    | "OTHER"
    | "HUMANITARIAN_DONATIONS"
    | "DANGEROUS_GOODS";
  contentComments?: string;
  restrictionType?: string;
  restrictionComments?: string;
  AESITN?: string;
  invoiceNumber?: string;
  licenseNumber?: string;
  certificateNumber?: string;
  contents: Array<{
    itemDescription: string;
    itemQuantity: number;
    itemTotalValue: number;
    itemTotalWeight: number;
    weightUOM: "lb";
    countryofOrigin?: string;
    HSTariffNumber?: string;
  }>;
  importersReference?: string;
  importersContact?: string;
  exportersReference?: string;
  exportersContact?: string;
}

export interface UspsLabelReprintRequest {
  imageInfo?: UspsImageInfo;
}

/**
 * Response from application/vnd.usps.labels+json format.
 * Metadata fields are at the top level (extends LabelMetadata),
 * images are base64-encoded strings alongside.
 */
export interface UspsLabelResponse extends UspsLabelMetadata {
  labelImage: string; // base64 encoded
  receiptImage?: string; // base64 encoded
  labelBrokerQR?: string; // base64 encoded (when imageType=LABEL_BROKER)
  returnLabel?: {
    returnLabelMetadata: UspsLabelMetadata;
    returnLabelImage?: string; // base64 encoded
    returnReceiptImage?: string; // base64 encoded
  };
}

export interface UspsLabelMetadata {
  trackingNumber: string;
  routingInformation?: string;
  constructCode?: string;
  SKU?: string;
  postage?: number;
  extraServices?: Array<{
    name: string;
    SKU: string;
    price: number;
  }>;
  zone?: string;
  serviceTypeCode?: string;
  mailingDate?: string;
  commitment?: {
    scheduleDeliveryDate?: string;
    expectedDeliveryDate?: string;
    isPriorityMailNextDay?: boolean;
  };
  weight?: number;
  weightUOM?: string;
  dimensionalWeight?: number;
  fees?: Array<{
    name: string;
    SKU: string;
    price: number;
  }>;
  labelBrokerID?: string;
  bannerText?: string;
  permitHolderName?: string;
  inductionType?: string;
  retailDistributionCode?: string;
  returnReceiptTrackingNumber?: string;
  labelAddress?: Record<string, unknown>;
}

export interface UspsCancelResponse {
  trackingNumber: string;
  status: "CANCELED" | "DISPUTED";
  disputeId?: string;
}
