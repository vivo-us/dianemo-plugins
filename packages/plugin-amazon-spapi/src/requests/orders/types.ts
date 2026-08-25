import { AmazonMarketplaceId } from "../../utils/amazonSpapiData.js";

export type FulfillmentChannel = "MFN" | "AFN";

type OrderStatus =
  | "PendingAvailability"
  | "Pending"
  | "Unshipped"
  | "PartiallyShipped"
  | "Shipped"
  | "InvoiceUnconfirmed"
  | "Canceled"
  | "Unfulfillable";
type PaymentMethod = "COD" | "CVS" | "Other";
type EasyShipShipmentStatus =
  | "PendingSchedule"
  | "PendingPickUp"
  | "PendingDropOff"
  | "LabelCanceled"
  | "PickedUp"
  | "DroppedOff"
  | "AtOriginFC"
  | "AtDestinationFC"
  | "Delivered"
  | "RejectedByBuyer"
  | "Undeliverable"
  | "ReturningToSeller"
  | "ReturnedToSeller"
  | "Lost"
  | "OutForDelivery"
  | "Damaged";
type AmazonTaxModel = "MarketplaceFacilitator";
type AmazonResponsibleParty = "Amazon Services, Inc.";
type AmazonDeemedResellerCategory = "IOSS" | "UOSS" | "GB_VOEC" | "NO_VOEC";
type AmazonConditionId =
  "New" | "Used" | "Collectible" | "Refurbished" | "Preorder" | "Club";
type AmazonConditionSubtypeId =
  | "New"
  | "Mint"
  | "Very Good"
  | "Good"
  | "Acceptable"
  | "Poor"
  | "Club"
  | "OEM"
  | "Warranty"
  | "Refurbished Warranty"
  | "Refurbished"
  | "Open Box"
  | "Any"
  | "Other";
type AmazonPriceDesignation = "BusinessPrice";
type AmazonShipmentServiceLevelCategory =
  | "Expedited"
  | "FreeEconomy"
  | "NextDay"
  | "SameDay"
  | "SecondDay"
  | "Scheduled"
  | "Standard";
type AmazonOrderType =
  | "StandardOrder"
  | "Preorder"
  | "BackOrder"
  | "LongLeadTimeOrder"
  | "SourcingOnDemandOrder";
type AmazonBuyerInvoicePreference = "INDIVIDUAL" | "BUSINESS";
type AmazonElectronicInvoiceStatus =
  "NotRequired" | "NotFound" | "Processing" | "Errored" | "Accepted";

interface AmazonAutomatedShippingSettings {
  HasAutomatedShippingSettings?: boolean;
  AutomatedCarrier?: string;
  AutomatedShipMethod?: string;
}

interface AmazonTaxClassification {
  Name?: string;
  Value?: string;
}

interface AmazonMarketplaceTaxInfo {
  TaxClassifications?: AmazonTaxClassification[];
}

interface AmazonBuyerTaxInformation {
  BuyerLegalCompanyName?: string;
  BuyerBusinessAddress?: string;
  BuyerTaxRegistrationId?: string;
  BuyerTaxOffice?: string;
}

export interface AmazonAddress {
  Name: string;
  AddressLine1: string;
  AddressLine2?: string;
  AddressLine3?: string;
  City?: string;
  County?: string;
  District?: string;
  StateOrRegion?: string;
  Municipality?: string;
  PostalCode?: string;
  CountryCode?: string;
  Phone?: string;
  AddressType?: "Commercial" | "Residential";
}

interface AmazonBuyerInfo {
  BuyerEmail?: string;
  BuyerCustomizedInfo?: {
    CustomizedURL?: string;
  };
  GiftWrapPrice?: AmazonCurrency;
  GiftWrapTax?: AmazonCurrency;
  GiftMessageText?: string;
  GiftWrapLevel?: string;
}

interface AmazonCurrency {
  CurrencyCode?: string;
  Amount?: string;
}

interface AmazonError {
  code: string;
  message: string;
  details?: string;
}

interface TaxCollection {
  Model?: AmazonTaxModel;
  ResponsibleParty?: AmazonResponsibleParty;
}

interface PointsGranted {
  PointsNumber?: number;
  PointsMonetaryValue?: AmazonCurrency;
}

interface ProductInfo {
  NumberOfItems?: number;
}

export interface AmazonOrderItem {
  ASIN: string;
  SellerSKU?: string;
  OrderItemId: string;
  Title?: string;
  QuantityOrdered: number;
  QuantityShipped?: number;
  ProductInfo: ProductInfo;
  PointsGranted?: PointsGranted;
  ItemPrice?: AmazonCurrency;
  ShippingPrice?: AmazonCurrency;
  ItemTax?: AmazonCurrency;
  ShippingTax?: AmazonCurrency;
  ShippingDiscount?: AmazonCurrency;
  ShippingDiscountTax?: AmazonCurrency;
  PromotionDiscount?: AmazonCurrency;
  PromotionDiscountTax?: AmazonCurrency;
  PromotionIds?: string[];
  CODFee?: AmazonCurrency;
  CODFeeDiscount?: AmazonCurrency;
  IsGift?: boolean;
  ConditionNote?: string;
  ConditionId?: AmazonConditionId;
  ConditionSubtypeId?: AmazonConditionSubtypeId;
  ScheduledDeliveryStartDate?: string;
  ScheduledDeliveryEndDate?: string;
  PriceDesignation?: AmazonPriceDesignation;
  TaxCollection?: TaxCollection;
  SerialNumberRequired?: boolean;
  IsTransparency?: boolean;
  IossNumber?: string;
  StoreChainStoreId?: string;
  DeemedResellerCategory?: AmazonDeemedResellerCategory;
  BuyerInfo?: AmazonBuyerInfo;
  BuyerRequestedCancel?: {
    IsBuyerRequestedCancel?: boolean;
    BuyerCancelReason?: string;
  };
}

export interface AmazonOrderItemsPayload {
  AmazonOrderId: string;
  NextToken?: string;
  OrderItems: AmazonOrderItem[];
}

export interface GetAmazonOrderItemsResponse {
  payload: AmazonOrderItemsPayload;
  errors: AmazonError[];
}

interface AmazonPaymentExecutionDetailItem {
  Payment: AmazonCurrency;
  PaymentMethod: "COD" | "GC" | "PointsAccount";
}

export interface AmazonOrder {
  AmazonOrderId: string;
  SellerOrderId?: string;
  PurchaseDate: string;
  LastUpdateDate: string;
  OrderStatus: OrderStatus;
  FulfillmentChannel?: FulfillmentChannel;
  SalesChannel?: string;
  OrderChannel?: string;
  ShipServiceLevel?: string;
  OrderTotal?: AmazonCurrency;
  NumberOfItemsShipped?: number;
  NumberOfItemsUnshipped?: number;
  PaymentExecutionDetail?: AmazonPaymentExecutionDetailItem[];
  PaymentMethod?: PaymentMethod;
  PaymentMethodDetails?: string[];
  MarketplaceId?: AmazonMarketplaceId;
  ShipmentServiceLevelCategory?: AmazonShipmentServiceLevelCategory;
  EasyShipShipmentStatus?: EasyShipShipmentStatus;
  CbaDisplayableShippingLabel?: string;
  OrderType?: AmazonOrderType;
  EarliestShipDate?: string;
  LatestShipDate?: string;
  EarliestDeliveryDate?: string;
  LatestDeliveryDate?: string;
  IsBusinessOrder?: boolean;
  IsPrime?: boolean;
  IsPremiumOrder?: boolean;
  IsGlobalExpressEnabled?: boolean;
  ReplacedOrderId?: string;
  IsReplacementOrder?: string;
  PromiseResponseDueDate?: string;
  IsEstimatedShipDateSet?: boolean;
  IsSoldByAB?: boolean;
  IsIBA?: boolean;
  DefaultShipFromLocationAddress?: AmazonAddress;
  BuyerInvoicePreference?: AmazonBuyerInvoicePreference;
  BuyerTaxInformation?: AmazonBuyerTaxInformation;
  FulfillmentInstruction?: {
    FulfillmentSupplySourceId?: string;
  };
  IsISPU?: boolean;
  IsAccessPointOrder?: boolean;
  MarketplaceTaxInfo?: AmazonMarketplaceTaxInfo;
  SellerDisplayName?: string;
  ShippingAddress?: AmazonAddress;
  BuyerInfo?: AmazonBuyerInfo;
  AutomatedShippingSettings?: AmazonAutomatedShippingSettings;
  HasRegulatedItems?: boolean;
  ElectronicInvoiceStatus?: AmazonElectronicInvoiceStatus;
}

interface AmazonOrdersPayload {
  Orders: AmazonOrder[];
  NextToken?: string;
  LastUpdatedBefore?: string;
  CreatedBefore?: string;
}

export interface GetAmazonOrderDetailsResponse {
  errors: AmazonError[];
  payload: AmazonOrder;
}

export interface GetAmazonOrdersResponse {
  errors: AmazonError[];
  payload: AmazonOrdersPayload;
}

export interface AmazonConfirmShipmentPayload {
  packageDetail: PackageDetail;
  marketplaceId: AmazonMarketplaceId;
  codCollectionMethod?: "DirectPayment";
}

export interface PackageDetail {
  packageReferenceId: string;
  carrierCode: string;
  trackingNumber: string;
  shipDate: string;
  orderItems: ConfirmShipmentOrderItem[];
  carrierName?: string;
  shippingMethod?: string;
  shipFromSupplySourceId?: string;
}

interface ConfirmShipmentOrderItem {
  orderItemId: string;
  quantity: number;
  transparencyCodes?: string[];
}

export interface AmazonGetOrderBuyerInfoResponse {
  payload: {
    AmazonOrderId: string;
    BuyerEmail: string;
    BuyerName: string;
    BuyerCounty?: string;
    BuyerTaxInfo?: {
      CompanyLegalName?: string;
      TaxingRegion?: string;
      TaxClassifications?: AmazonTaxClassification[];
    };
    PurchaseOrderNumber?: string;
  };
}

export interface AmazonGetOrderAddressResponse {
  payload: {
    AmazonOrderId: string;
    ShippingAddress: AmazonAddress;
  };
}
