import { WalmartBoolean, WalmartError, WalmartPrice } from "../types.js";
import { CurrencyCodes } from "@dianemo/plugin-kit";

type WalmartCarrier =
  | "UPS"
  | "USPS"
  | "FedEx"
  | "Airborne"
  | "OnTrac"
  | "DHL Ecommerce - US"
  | "DHL"
  | "LS"
  | "UDS"
  | "UPSMI"
  | "FDX"
  | "PILOT"
  | "ESTES"
  | "SAIA"
  | "FDS Express"
  | "Seko Worldwide"
  | "HIT Delivery"
  | "FEDEXSP"
  | "RL Carriers"
  | "Metropolitan Warehouse & Delivery"
  | "China Post"
  | "YunExpress"
  | "Yellow Freight Sys"
  | "AIT Worldwide Logistics"
  | "Chukou1"
  | "Sendle"
  | "Landmark Global"
  | "Sunyou"
  | "Yanwen"
  | "4PX"
  | "GLS"
  | "OSM Worldwide"
  | "FIRST MILE"
  | "AM Trucking"
  | "CEVA"
  | "India Post"
  | "SF Express"
  | "CNE"
  | "TForce Freight"
  | "AxleHire"
  | "LSO"
  | "Royal Mail"
  | "ABF Freight System"
  | "WanB"
  | "Roadrunner Freight"
  | "Meyer Distribution"
  | "AAA Cooper"
  | "Canada Post"
  | "Southeastern Freight Lines"
  | "Japan Post"
  | "Correos de Mexico"
  | "XPO Logistics"
  | "JD Logistics"
  | "YDH"
  | "JCEX"
  | "Flyt"
  | "Deutsche Post"
  | "Better Trucks"
  | "Asendia"
  | "SFC"
  | "UBI"
  | "ePost Global"
  | "YF Logistics"
  | "RXO"
  | "Estes Express"
  | "Shypmax"
  | "WIN.IT America"
  | "PITT OHIO"
  | "PostNord Sweden"
  | "Equick"
  | "Whistl"
  | "Tusou"
  | "Shiprocket"
  | "DTDC"
  | "PTS";

type WalmartCarrierMethodName =
  | "FEDEX_HOME_DELIVERY"
  | "FEDEX_EXPRESS"
  | "FEDEX_2DAY_EXPRESS"
  | "FEDEX_OVERNIGHT"
  | "FEDEX_GROUND_ECONOMY"
  | "UPS_GROUND"
  | "UPS_3DAY_SELECT"
  | "UPS_2DAY_AIR"
  | "UPS_NEXTDAY_AIR"
  | "UPS_SUREPOST"
  | "USPS_GROUND"
  | "USPS_PRIORITY_MAIL"
  | "USPS_PRIORITY_MAIL_EXPRESS";

type WalmartRefundReason =
  | "BillingError"
  | "TaxExemptCustomer"
  | "ItemNotAsAdvertised"
  | "IncorrectItemReceived"
  | "CancelledYetShipped"
  | "ItemNotReceivedByCustomer"
  | "IncorrectShippingPrice"
  | "DamagedItem"
  | "DefectiveItem"
  | "CustomerChangedMind"
  | "CustomerReceivedItemLate"
  | "Missing Parts / Instructions"
  | "Finance -> Goodwill"
  | "Finance -> Rollback"
  | "Buyer canceled"
  | "Customer returned item"
  | "General adjustment"
  | "Merchandise not received"
  | "Quality -> Missing Parts / Instructions"
  | "Shipping & Delivery -> Damaged"
  | "Shipping & Delivery -> Shipping Price Discrepancy"
  | "Others";

type WalmartOrderStatus =
  "Created" | "Acknowledged" | "Shipped" | "Delivered" | "Cancelled" | "Refund";

type WalmartCancelReason =
  | "CUSTOMER_REQUESTED_SELLER_TO_CANCEL"
  | "SELLER_CANCEL_PRICING_ERROR"
  | "SELLER_CANCEL_OUT_OF_STOCK"
  | "SELLER_CANCEL_FRAUD_STOP_SHIPMENT"
  | "SELLER_CANCEL_ADDRESS_NOT_SERVICEABLE";

type WalmartShipNodeType = "SellerFulfilled" | "WFSFulfilled" | "3PLFulfilled";

type WalmartShippingProgramType = "TWO_DAY" | "ONE_DAY";

type WalmartOrderType = "REGULAR" | "REPLACEMENT" | "PREORDER";

export interface GetWalmartReleasedOrdersData {
  createdStartDate?: string;
  createdEndDate?: string;
  limit?: string;
  productInfo?: WalmartBoolean;
  shipNodeType?: WalmartShipNodeType;
  sku?: string;
  customerOrderId?: string;
  purchaseOrderId?: string;
  fromExpectedShipDate?: string;
  toExpectedShipDate?: string;
  shippingProgramType?: WalmartShippingProgramType;
  replacementInfo?: WalmartBoolean;
  orderType?: WalmartOrderType;
  incentiveInfo?: WalmartBoolean;
}

export interface GetWalmartOrdersData extends GetWalmartReleasedOrdersData {
  status?: WalmartOrderStatus;
  lastModifiedStartDate?: string;
  lastModifiedEndDate?: string;
}

export interface GetWalmartOrderData {
  productInfo?: WalmartBoolean;
  replacementInfo?: WalmartBoolean;
}

export interface GetWalmartOrdersResponse {
  list: WalmartList;
}

/**
 * GET /v3/orders/{purchaseOrderId} wraps the order the same way the acknowledge
 * response does, rather than returning a bare order.
 */
export interface GetWalmartOrderResponse {
  order: WalmartOrder;
}

export interface AcknowledgeWalmartOrderResponse {
  order: WalmartOrder;
}

interface WalmartList {
  errors: WalmartError[];
  meta: {
    totalCount?: number;
    limit?: number;
    nextCursor?: string;
  };
  elements: {
    order: WalmartOrder[];
  };
}

export interface WalmartOrder {
  purchaseOrderId: string;
  customerOrderId: string;
  customerEmailId: string;
  orderType?: WalmartOrderType;
  originalCustomerOrderID?: string;
  orderDate: number;
  buyerId?: string;
  mart?: string;
  isGuest?: boolean;
  shippingInfo: WalmartOrderShippingInfo;
  orderLines: {
    orderLine: WalmartOrderLine[];
  };
  paymentTypes?: string[];
  orderSummary?: {
    totalAmount: WalmartCurrency;
    orderSubTotals: {
      subTotalType: string;
      totalAmount: WalmartCurrency;
    }[];
  };
  pickupPersons?: WalmartPickupPerson[];
  shipNode: {
    type?: WalmartShipNodeType;
    name?: string;
    id?: string;
  };
}

interface WalmartOrderShippingInfo {
  phone: string;
  estimatedDeliveryDate: number;
  estimatedShipDate: number;
  methodCode:
    "Standard" | "Express" | "OneDay" | "Freight" | "WhiteGlove" | "Value";
  postalAddress: WalmartPostalAddress;
  carrierMethodName?: WalmartCarrierMethodName;
}

interface WalmartOrderLine {
  lineNumber: string;
  item: {
    productName: string;
    sku: string;
    condition?: string;
    imageUrl?: string;
    weight?: WalmartWeight;
  };
  incentive?: WalmartOrderLineIncentive;
  charges: {
    charge: WalmartCharge[];
  };
  orderLineQuantity: WalmartQuantity;
  statusDate: number;
  orderLineStatuses: {
    orderLineStatus: WalmartOrderLineStatus[];
  };
  returnOrderId?: string;
  refund?: WalmartRefund;
  originalCarrierMethod?: string;
  referenceLineId?: string;
  fulfillment?: WalmartFulfillment;
  serialNumbers?: string[];
  intentToCancel?: string;
  configId?: string;
  sellerOrderId?: string;
}

interface WalmartOrderLineIncentive {
  type?: "Walmart funded" | "Reduced referral";
  originalPrice?: WalmartPrice;
  walmartFundedIncentive?: WalmartPrice;
  originalReferralFee?: {
    percentageApplied: number;
  };
  reducedReferralFeeDiscount?: {
    percentageApplied: number;
  };
}

interface WalmartCurrency {
  currencyAmount: number;
  currencyUnit: CurrencyCodes;
}

interface WalmartPickupPerson {
  name?: {
    completeName?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    generalSuffix?: string;
    maturitySuffix?: string;
    titleOfRespect?: string;
    empty?: boolean;
  };
  phone?: {
    id?: string;
    areaCode?: string;
    extension?: string;
    completeNumber?: string;
    type?: "MOBILE" | "HOME" | "WORK";
    subscriberNumber?: string;
    countryCode?: string;
    phoneValidity?: {
      validationType?: "SMS" | "IVR" | "CALL" | "UNKNOWN";
      validationStatus?: "SUCCESS" | "FAILURE" | "SKIPPED" | "UNKNOWN";
      validatedDate?: string;
      validatedBy?: string;
    };
  };
}

interface WalmartWeight {
  value: string;
  unit: string;
}

interface WalmartCharge {
  chargeType: "PRODUCT" | "SHIPPING";
  chargeName: string;
  chargeAmount: WalmartPrice;
  tax?: WalmartTax;
  taxAndOtherFees?: WalmartTax;
}

interface WalmartTax {
  taxName: string;
  taxAmount: WalmartPrice;
}

interface WalmartOrderLineStatus {
  status: WalmartOrderStatus;
  statusQuantity: WalmartQuantity;
  cancellationReason?: string;
  trackingInfo?: WalmartTrackingInfo;
  returnCenterAddress?: WalmartReturnCenterAddress;
}

interface WalmartQuantity {
  unitOfMeasurement: "EACH" | "EA";
  amount: string;
}

interface WalmartTrackingInfo {
  shipDateTime: number;
  carrierName: {
    otherCarrier?: string;
    carrier?: WalmartCarrier;
  };
  methodCode:
    "Standard" | "Express" | "OneDay" | "Freight" | "WhiteGlove" | "Value";
  trackingNumber: string;
  trackingURL?: string;
}

interface WalmartBaseAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface WalmartPostalAddress extends WalmartBaseAddress {
  addressType?: "RESIDENTIAL" | string;
}

interface WalmartReturnCenterAddress extends WalmartBaseAddress {
  dayPhone?: string;
  emailId?: string;
}

interface WalmartRefund {
  refundId?: string;
  refundComments?: string;
  refundCharges: {
    refundCharge: {
      refundReason: WalmartRefundReason;
      charge: WalmartCharge;
    }[];
  };
}

interface WalmartFulfillment {
  fulfillmentOption?: "S2H" | "S2S" | string;
  shipMethod?: string;
  storeId?: string;
  pickUpDateTime?: number;
  pickUpBy?: string;
  shippingProgramType?: string;
}

export interface WalmartShipOrderData {
  orderShipment: {
    processMode?: string;
    orderLines: {
      orderLine: {
        lineNumber: string;
        intentToCancelOverride?: boolean;
        sellerOrderId: string;
        orderLineStatuses: {
          orderLineStatus: {
            status: WalmartOrderStatus;
            asn?: {
              packageASN: string;
              palletASN?: string;
            };
            statusQuantity: WalmartQuantity;
            trackingInfo: WalmartTrackingInfo;
            returnCenterAddress?: WalmartReturnCenterAddress;
            currentTrackingInfo?: {
              trackingNumber: string;
            };
          }[];
        };
        sellerOrderNo?: string;
      }[];
    };
  };
}

export interface WalmartCancelOrderData {
  orderLines: {
    orderLine: {
      lineNumber: string;
      orderLineStatuses: {
        orderLineStatus: {
          status: WalmartOrderStatus;
          cancellationReason: WalmartCancelReason;
          statusQuantity: WalmartQuantity;
        };
      };
    }[];
  };
}

export interface WalmartRefundOrderData {
  purchaseOrderId: string;
  orderLines: {
    orderLine: {
      lineNumber: string;
      isFullRefund: boolean;
      refunds: {
        refund: {
          refundId?: string;
          refundComments?: string;
          refundCharges: {
            refundCharge: {
              refundReason: WalmartRefundReason;
              charge: WalmartCharge;
            }[];
          };
        }[];
      };
    }[];
  };
}
