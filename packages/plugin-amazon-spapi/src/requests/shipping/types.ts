type AmazonShipmentDocumentType =
  "PACKSLIP" | "LABEL" | "RECEIPT" | "CUSTOM_FORM";

type AmazonPackingInstruction =
  | "PI965_SECTION_IA"
  | "PI965_SECTION_IB"
  | "PI965_SECTION_II"
  | "PI966_SECTION_I"
  | "PI966_SECTION_II"
  | "PI967_SECTION_I"
  | "PI967_SECTION_II"
  | "PI968_SECTION_IA"
  | "PI968_SECTION_IB"
  | "PI969_SECTION_I"
  | "PI969_SECTION_II"
  | "PI970_SECTION_I"
  | "PI970_SECTION_II";

type AmazonLabelAttributes =
  | "PACKAGE_CLIENT_REFERENCE_ID"
  | "SELLER_DISPLAY_NAME"
  | "COLLECT_ON_DELIVERY_AMOUNT";

type AmazonRateItemId =
  | "BASE_RATE"
  | "TRANSACTION_FEE"
  | "ADULT_SIGNATURE_CONFIRMATION"
  | "SIGNATURE_CONFIRMATION"
  | "NO_CONFIRMATION"
  | "WAIVE_SIGNATURE"
  | "IMPLIED_LIABILITY"
  | "HIDDEN_POSTAGE"
  | "DECLARED_VALUE"
  | "SUNDAY_HOLIDAY_DELIVERY"
  | "DELIVERY_CONFIRMATION"
  | "IMPORT_DUTY_CHARGE"
  | "VAT"
  | "NO_SATURDAY_DELIVERY"
  | "INSURANCE"
  | "COD"
  | "FUEL_SURCHARGE"
  | "INSPECTION_CHARGE"
  | "DELIVERY_AREA_SURCHARGE"
  | "WAYBILL_CHARGE"
  | "AMAZON_SPONSORED_DISCOUNT"
  | "INTEGRATOR_SPONSORED_DISCOUNT"
  | "OVERSIZE_SURCHARGE"
  | "CONGESTION_CHARGE"
  | "RESIDENTIAL_SURCHARGE"
  | "ADDITIONAL_SURCHARGE"
  | "SURCHARGE"
  | "REBATE"
  | "HIGH_CUBE_SURCHARGE"
  | "HIGH_LENGTH_SURCHARGE"
  | "HIGH_WIDTH_SURCHARGE"
  | "DEMAND_SURCHARGE"
  | "NONSTANDARD_FEE";

type AmazonIneligibilityReasonCode =
  | "NO_COVERAGE"
  | "PICKUP_SLOT_RESTRICTION"
  | "UNSUPPORTED_VAS"
  | "VAS_COMBINATION_RESTRICTION"
  | "SIZE_RESTRICTIONS"
  | "WEIGHT_RESTRICTIONS"
  | "LATE_DELIVERY"
  | "PROGRAM_CONSTRAINTS"
  | "TERMS_AND_CONDITIONS_NOT_ACCEPTED"
  | "UNKNOWN";

type AmazonClientReferenceType = "IntegratorShipperId" | "IntegratorMerchantId";
type AmazonLiquidUnit = "ML" | "L" | "FL_OZ" | "GAL" | "PT" | "QT" | "C";
type AmazonWeightUnit = "OUNCE" | "POUND" | "GRAM" | "KILOGRAM";
type AmazonRateItemType = "MANDATORY" | "OPTIONAL" | "INCLUDED";
type AmazonShipmentDocumentFormat = "PDF" | "ZPL" | "PNG";
type AmazonChannelType = "AMAZON" | "EXTERNAL";
type AmazonLengthUnit = "INCH" | "CENTIMETER";
type AmazonPackingGroup = "I" | "II" | "III";
type AmazonChargeType = "TAX" | "DISCOUNT";
type AmazonShipmentType = "FORWARD" | "RETURNS";
type AmazonTaxType = "GST";

export interface AmazonGetRatesRequest {
  shipTo?: AmazonAddress;
  shipFrom: AmazonAddress;
  returnTo?: AmazonAddress;
  shipDate?: string;
  packages: AmazonPackage[];
  valueAddedServices?: AmazonValueAddedServiceDetails[];
  taxDetails?: AmazonTaxDetail[];
  channelDetails: AmazonChannelDetails;
  clientReferenceDetails?: AmazonClientReferenceDetails[];
  shipmentType?: AmazonShipmentType;
  destinationAccessPointDetails?: AmazonDestinationAccessPointDetails;
}

export interface AmazonGetRatesResponse {
  payload: {
    requestToken: string;
    rates: AmazonRate[];
    ineligibleRates: AmazonIneligibleRate[];
  };
}

export interface AmazonPurchaseShipmentRequest {
  requestToken: string;
  rateId: string;
  requestedDocumentSpecification: AmazonRequestedDocumentSpecification;
  requestedValueAddedServices: RequestedValueAddedServices[];
  additionalInputs?: object;
}

export interface AmazonPurchaseShipmentResponse {
  payload: AmazonPurchasedShipment;
}

export interface AmazonShipmentCancellationResponse {
  payload: object;
}

export interface AmazonAddress {
  name: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  stateOrRegion?: string;
  city: string;
  /**
   * The two digit country code. In ISO 3166-1 alpha-2 format.
   */
  countryCode: string;
  postalCode: string;
  email?: string;
  phoneNumber?: string;
  geocode?: AmazonGeocode;
}

interface AmazonGeocode {
  latitude?: number;
  longitude?: number;
}

export interface AmazonPackage {
  dimensions: AmazonDimensions;
  weight: AmazonWeight;
  insuredValue: AmazonCurrency;
  isHazmat?: boolean;
  sellerDisplayName?: string;
  charges?: AmazonShippingCharge[];
  /**
   * A client provided unique identifier for a package being shipped. This value should be saved by the client to pass as a parameter to the getShipmentDocuments operation.
   */
  packageClientReferenceId: string;
  items: AmazonItem[];
}

interface AmazonDimensions {
  length: number;
  width: number;
  height: number;
  unit: AmazonLengthUnit;
}

interface AmazonWeight {
  value: number;
  unit: AmazonWeightUnit;
}

interface AmazonCurrency {
  value: number;
  /**
   * The ISO 4217 format 3-character currency code.
   */
  unit: string;
}

interface AmazonShippingCharge {
  amount?: AmazonCurrency;
  chargeType?: AmazonChargeType;
}

interface AmazonItem {
  itemValue: AmazonCurrency;
  description?: string;
  itemIdentifier?: string;
  quantity: number;
  weight: AmazonWeight;
  liquidVolume?: AmazonLiquidVolume;
  isHazmat?: boolean;
  dangeroudGoodsDetails?: AmazonDangerousGoodsDetails;
  productType?: string;
  invoiceDetails?: AmazonInvoiceDetails;
  serialNumbers?: string[];
  directFulfillmentItemIdentifiers?: AmazonDirectFulfillmentItemIdentifiers;
}

interface AmazonLiquidVolume {
  value: number;
  unit: AmazonLiquidUnit;
}

interface AmazonDangerousGoodsDetails {
  unitedNationsRegulatoryId?: string;
  transportationRegulatoryClass?: string;
  packingGroup?: AmazonPackingGroup;
  packingInstruction?: AmazonPackingInstruction;
}

interface AmazonInvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
}

interface AmazonDirectFulfillmentItemIdentifiers {
  lineItemID: string;
  pieceNumber?: string;
}

interface AmazonValueAddedServiceDetails {
  collectOnDelivery?: {
    amount: AmazonCurrency;
  };
}

interface AmazonTaxDetail {
  taxType: AmazonTaxType;
  taxRegistrationNumber: string;
}

interface AmazonChannelDetails {
  channelType: AmazonChannelType;
  amazonOrderDetails?: {
    orderId: string;
  };
  amazonShipmentDetails?: {
    shipmentId: string;
  };
}

interface AmazonClientReferenceDetails {
  clientReferenceType: AmazonClientReferenceType;
  clientReferenceId: string;
}

interface AmazonDestinationAccessPointDetails {
  accessPointId?: string;
}

interface AmazonRate {
  rateId: string;
  carrierId: string;
  carrierName: string;
  serviceId: string;
  serviceName: string;
  billedWeight?: AmazonWeight;
  totalCharge: AmazonCurrency;
  promise: AmazonPromise;
  supportedDocumentSpecifications: SupportedDocumentSpecifications[];
  availableValueAddedServiceGroups: AvailableValueAddedServiceGroup[];
  requiresAdditionalInputs: boolean;
  rateItemList: RateItem[];
  paymentType: object;
  benefits: AmazonBenefits;
}

interface AmazonPromise {
  deliveryWindow: AmazonWindow;
  pickupWindow: AmazonWindow;
}

export interface SupportedDocumentSpecifications {
  format: AmazonShipmentDocumentFormat;
  size: AmazonDocumentSize;
  printOptions: AmazonPrintOptions[];
}

interface AmazonPrintOptions {
  supportedDPIs: number[];
  supportedPageLayouts: string[];
  supportedFileJoiningOptions: boolean[];
  supportedDocumentDetails: AmazonSupportedDocumentDetails[];
}

interface AmazonSupportedDocumentDetails {
  isMandatory: boolean;
  name: AmazonShipmentDocumentType;
}

export interface AvailableValueAddedServiceGroup {
  groupId: string;
  groupDescription: string;
  isRequired: boolean;
  valueAddedServices: AmazonValueAddedService[];
}

interface AmazonValueAddedService {
  id: string;
  name: string;
  cost: AmazonCurrency;
}

interface RateItem {
  rateItemID?: AmazonRateItemId;
  rateItemType?: AmazonRateItemType;
  rateItemCharge?: AmazonCurrency;
  rateItemNameLocalization?: string;
}

interface AmazonBenefits {
  includedBenefits: string[];
  excludedBenefits: AmazonExludedBenefit[];
}

interface AmazonExludedBenefit {
  benefit: string;
  reasonCodes?: string[];
}

interface AmazonIneligibleRate {
  serviceId: string;
  serviceName: string;
  carrierName: string;
  carrierId: string;
  ineligibilityReasons: AmazonIneligibilityReason[];
}

interface AmazonIneligibilityReason {
  code: AmazonIneligibilityReasonCode;
  message: string;
}

interface AmazonRequestedDocumentSpecification {
  format: AmazonShipmentDocumentFormat;
  size: AmazonDocumentSize;
  dpi: number;
  pageLayout: string;
  needFileJoining: boolean;
  requestedDocumentTypes: AmazonShipmentDocumentType[];
  requestedLabelCustomization?: AmazonLabelAttributes[];
}

interface AmazonDocumentSize {
  width: number;
  length: number;
  unit: AmazonLengthUnit;
}

export interface RequestedValueAddedServices {
  id: string;
}

export interface AmazonPurchasedShipment {
  shipmentId: string;
  packageDocumentDetails: AmazonPurchasedShipmentDocument[];
  promise: AmazonPurchasedShipmentPromise;
  benefits?: AmazonBenefits;
}

export interface AmazonPurchasedShipmentDocument {
  packageClientReferenceId: string;
  packageDocuments: AmazonPackageDocument[];
  trackingId?: string;
}

interface AmazonPackageDocument {
  type: AmazonShipmentDocumentType;
  format: AmazonShipmentDocumentFormat;
  /** Base64 Encoded */
  contents: string;
}

interface AmazonPurchasedShipmentPromise {
  deliveryWindow?: AmazonWindow;
  pickupWindow?: AmazonWindow;
}

interface AmazonWindow {
  start: string;
  end: string;
}
