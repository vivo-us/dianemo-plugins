import { CAPagingQueryOptions, CAQueryOptions, Flag } from "../types.js";
import { BundleComponent } from "../products/bundleComponents/types.js";
import { CustomField } from "./customFields/types.js";
import {
  FulfillmentExpand,
  GetFulfillment,
  GetFulfillmentItem,
} from "./fulfillments/types.js";

export type OrderExpandOptions =
  "Items" | "Fulfillments" | "Adjustments" | "CustomFields";

export type OrderExpand = {
  options?: OrderExpandOptions[];
  children?: {
    Items?: OrderItemExpand;
    Fulfillments?: FulfillmentExpand;
  };
};

export type OrderItemExpandOptions =
  "FulfillmentItems" | "BundleComponents" | "Promotions" | "Adjustments";

export type OrderItemExpand = {
  options?: OrderItemExpandOptions[];
  children?: { Promotions: { options: "Items"[] } };
};

export type GetOrdersOptions = CAPagingQueryOptions<
  keyof GetOrder,
  OrderExpand
>;

export type GetOrderOptions = CAQueryOptions<keyof GetOrder, OrderExpand>;

export type GetOrderItemsOptions = CAPagingQueryOptions<
  keyof GetOrderItem,
  OrderItemExpand
>;

export type Byte = 1 | 0;

export type CheckoutStatus =
  | "NotVisited"
  | "Completed"
  | "Visited"
  | "CompletedAndVisited"
  | "Disabled"
  | "CompletedOffline"
  | "OnHold";

export type PaymentStatus =
  "NotYetSubmitted" | "Cleared" | "Submitted" | "Failed" | "Deposited";

export type ShippingStatus =
  | "Unshipped"
  | "Shipped"
  | "PartiallyShipped"
  | "PendingShipment"
  | "Canceled"
  | "ThirdPartyManaged";

export type TaxType = "NoTax" | "Standard" | "ExclusiveVat" | "InclusiveVat";

export type AdjustmentSource = "Channel" | "UserInterface" | "Api" | "System";

export enum AdjustmentReason {
  /**
   * Through `CustomerExchangeOther`: ChannelAdvisor also categorises these as
   * "Other", so they are not tied to a specific store.
   */
  CustomerReturnOther = 1,
  GeneralAdjustmentOther = 2,
  MerchandiseNotReceivedOther = 5,
  BuyerCanceledOther = 6,
  ShippingAddressUndeliverableOther = 9,
  CustomerExchangeOther = 10,
  "GeneralAdjustment (default)" = 100,
  ItemNotAvailable = 101,
  CustomerReturnedItem = 102,
  CouldNotShip = 103,
  AlternateItemProvided = 104,
  BuyerCancelled = 105,
  CustomerExchange = 106,
  MerchandiseNotReceived = 107,
  ShippingAddressUndeliverable = 108,
}

export type AdjustmentType = "Refund (default)" | "Cancellation";

export enum RefundRestockStatus {
  NoChange = -999,
  Error = -1,
  SubmittedNotProcessed = 0,
  NewRma = 1,
  PendingApproval = 2,
  ProcessingApproval = 3,
  ReadyForReturn = 4,
  PendingReturn = 5,
  ProcessingReturn = 6,
  PendingRejection = 7,
  ProcessingRejection = 8,
  ProcessedNotAcknowledged = 10,
  PendingReturnRejection = 11,
  ProcessingReturnRejection = 12,
  AcknowledgedPostProcessingNotComplete = 20,
  PostProcessingComplete = 30,
  RejectionCompleted = 31,
  InformationOnly = 32,
}

export type DistributionCenterTypeRollup =
  "SellerManaged" | "ExternallyManaged" | "Mixed";

interface BaseOrder {
  SiteOrderID?: string;
  SecondarySiteOrderID?: string | null;
  SellerOrderID: string | null;
  CheckoutSourceID: Byte | null;
  PublicNotes?: string | null;
  PrivateNotes?: string;
  SpecialInstructions?: string;
  TotalPrice?: number;
  EstimatedShipDateUtc?: string | null;
  DeliverByDateUtc?: string | null;
  FlagID?: Flag;
  FlagDescription?: string | null;
  CheckoutStatus?: CheckoutStatus;
  PaymentStatus?: PaymentStatus;
  ShippingStatus?: ShippingStatus;
  CheckoutDateUtc?: string;
  PaymentDateUtc?: string;
  PaymentMethod?: string;
  PaymentTransactionID?: string | null;
  PaymentPaypalAccountID?: string | null;
  PaymentCreditCardLast4?: string;
  PaymentMerchantReferenceNumber?: string | null;
  ShippingTitle?: string | null;
  ShippingFirstName?: string | null;
  ShippingLastName?: string | null;
  ShippingSuffix?: string | null;
  ShippingCompanyName?: string | null;
  ShippingCompanyJobTitle?: string | null;
  ShippingDaytimePhone?: string;
  ShippingEveningPhone?: string | null;
  ShippingAddressLine1?: string;
  ShippingAddressLine2?: string;
  ShippingCity?: string;
  ShippingStateOrProvince: string | null;
  ShippingStateOrProvinceName: string | null;
  ShippingPostalCode?: string;
  ShippingCountry?: string;
  BillingTitle?: string | null;
  BillingFirstName?: string | null;
  BillingLastName?: string | null;
  BillingSuffix?: string | null;
  BillingCompanyName?: string | null;
  BillingCompanyJobTitle?: string | null;
  BillingDaytimePhone?: string;
  BillingEveningPhone?: string | null;
  BillingAddressLine1?: string;
  BillingAddressLine2?: string;
  BillingCity?: string;
  BillingStateOrProvince: string | null;
  BillingStateOrProvinceName: string | null;
  BillingPostalCode?: string;
  BillingCountry?: string;
  PromotionCode?: string | null;
  OrderTags: string | null;
}

export interface GetOrder extends BaseOrder {
  ID: number;
  ProfileID: number;
  SiteID: number;
  SiteName: string;
  UserDataPresent: Byte;
  UserDataRemovalDateUTC: string | null;
  SiteAccountID: number;
  SiteOrderID: string;
  Currency: string;
  ImportDateUtc: string;
  CreatedDateUtc: string;
  UpdatedDateUtc: string;
  PrivateNotes: string;
  SpecialInstructions: string;
  TotalPrice: number;
  TotalTaxPrice: number;
  TotalShippingPrice: number;
  TotalShippingTaxPrice: number;
  TotalInsurancePrice: number;
  TotalGiftOptionPrice: number;
  TotalGiftOptionTaxPrice: number;
  AdditionalCostOrDiscount: number;
  RequestedShippingCarrier: string;
  RequestedShippingClass: string;
  ResellerID: string | null;
  FlagID: Flag;
  CheckoutStatus: CheckoutStatus;
  PaymentStatus: PaymentStatus;
  ShippingStatus: ShippingStatus;
  CheckoutDateUtc: string;
  PaymentDateUtc: string;
  ShippingDateUtc: string | null;
  BuyerUserId: string;
  BuyerEmailAddress: string;
  BuyerEmailOptIn: boolean;
  OrderTaxType: TaxType;
  ShippingTaxType: TaxType;
  GiftOptionsTaxType: TaxType;
  PaymentMethod: string;
  PaymentCreditCardLast4: string;
  ShippingDaytimePhone: string;
  ShippingAddressLine1: string;
  ShippingAddressLine2: string;
  ShippingCity: string;
  ShippingStateOrProvince: string | null;
  ShippingStateOrProvinceName: string | null;
  ShippingPostalCode: string;
  ShippingCountry: string;
  BillingDaytimePhone: string;
  BillingAddressLine1: string;
  BillingAddressLine2: string;
  BillingCity: string;
  BillingStateOrProvince: string | null;
  BillingStateOrProvinceName: string | null;
  BillingPostalCode: string;
  BillingCountry: string;
  PromotionAmount: number;
  DistributionCenterTypeRollup: DistributionCenterTypeRollup;
  Items?: GetOrderItem[];
  Fulfillments?: GetFulfillment[];
  Adjustments?: OrderAdjustment[];
  CustomFields?: CustomField[];
  OrderItemAttributes?: OrderItemAttributes[];
  OrderAttributes?: OrderAttributes[];
}

export interface CreateOrder extends BaseOrder {
  ProfileID?: number;
  SiteID?: number;
  SiteName?: string;
  Currency?: string;
  TotalPrice: number;
  TotalTaxPrice?: number;
  TotalShippingPrice?: number;
  TotalShippingTaxPrice?: number;
  TotalInsurancePrice?: number;
  TotalGiftOptionPrice?: number;
  TotalGiftOptionTaxPrice?: number;
  AdditionalCostOrDiscount?: number;
  RequestedShippingCarrier?: string;
  RequestedShippingClass?: string;
  ResellerID?: string;
  ShippingDateUtc?: string;
  BuyerUserId?: string;
  BuyerEmailAddress?: string;
  BuyerEmailOptIn?: boolean;
  OrderTaxType?: TaxType;
  ShippingTaxType?: TaxType;
  GiftOptionsTaxType?: TaxType;
  PromotionAmount?: number;
  Items: CreateOrderItem[];
}

export interface UpdateOrder extends Partial<BaseOrder> {
  Items?: UpdateOrderItem[];
}

export interface GetOrderItem {
  ID: number;
  OrderID: number;
  ProfileID: number;
  ProductID: number;
  ReferenceProductID?: number | null;
  SiteOrderItemID: string;
  SiteListingID: string;
  SellerOrderItemID: string | null;
  Sku: string;
  ReferenceSku: string | null;
  Title: string;
  Quantity: number;
  UnitPrice: number;
  TaxPrice: number;
  ShippingPrice: number;
  ShippingTaxPrice: number;
  RecyclingFee: number;
  UnitEstimatedShippingCost: number | null;
  GiftMessage: string | null;
  GiftNotes: string | null;
  GiftPrice: number;
  GiftTaxPrice: number;
  IsBundle: boolean;
  ItemURL: string;
  HarmonizedCode: string | null;
  Promotions: Promotion[];
  FulfillmentItems?: GetFulfillmentItem[];
  BundleComponents: OrderBundleComponent[];
  Adjustments: OrderItemAdjustment[];
  OrderItemAttributes: OrderItemAttributes[];
}

export interface CreateOrderItem {
  OrderID?: number;
  ProductID?: number;
  SiteOrderItemID?: string;
  SiteListingID?: string;
  SellerOrderItemID?: string;
  Sku: string;
  Quantity: number;
  UnitPrice?: number;
  TaxPrice?: number;
  ShippingPrice?: number;
  ShippingTaxPrice?: number;
  RecyclingFee?: number;
  UnitEstimatedShippingCost?: number;
  GiftMessage?: string;
  GiftNotes?: string;
  GiftPrice?: number;
  GiftTaxPrice?: number;
  IsBundle?: boolean;
  ItemURL?: string;
  HarmonizedCode?: string;
}

export interface UpdateOrderItem {
  ProductID?: number;
  SellerOrderItemID?: string;
}

interface OrderBundleComponent extends BundleComponent {
  OrderItemID: number;
  OrderID: number;
  BundleSku: string;
  Title: string;
}

export interface OrderAdjustment {
  CreatedSource: AdjustmentSource;
  LastUpdatedSource: AdjustmentSource;
  ID: number;
  ProfileID: number;
  OrderID: number;
  IsRestock: boolean;
  Reason: AdjustmentReason;
  ItemAdjustment: number;
  TaxAdjustment: number;
  ShippingAdjustment: number;
  ShippingTaxAdjustment: number;
  GiftWrapAdjustment: number;
  GiftWrapTaxAdjustment: number;
  RecyclingFeeAdjustment: number;
  Type: AdjustmentType;
  SellerAdjustmentID: string | null;
  SiteAdjustmentID: string | null;
  SiteRefundDateUtc: string | null;
  AdjustmentTransactionID: string | null;
  RmaNumber: string | null;
  Comment: string;
  PublicNotes: string | null;
  CreatedDateUtc: string;
  ReferenceSku: string | null;
  ReferenceProductID: number | null;
  RequestStatus: RefundRestockStatus;
  RestockStatus: RefundRestockStatus | null;
  ReturnShippingFee: number | null;
  RestockingFee: number | null;
  ReturnTrackingNumberOrUrl: string | null;
  ReturnShippingMethod: string | null;
}

export interface OrderItemAdjustment extends OrderAdjustment {
  OrderItemID: number;
  Quantity: number;
}

export interface Promotion {
  ID: number;
  Code: string;
  Amount: number;
  ShippingAmount: number;
}

export interface OrderItemAttributes {
  Value: string;
  Name: string;
  OrderID: number;
  ProfileID: number;
  OrderItemID: number;
}

export interface OrderAttributes {
  Value: string;
  Name: string;
  OrderID: number;
  ProfileID: number;
}
