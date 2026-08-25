import {
  NeweggBoolean,
  NeweggItemFulfillmentOption,
  NeweggNumericBoolean,
} from "../types.js";

export enum NeweggOrderStatus {
  UNSHIPPED = 0,
  PARTIALLY_SHIPPED = 1,
  SHIPPED = 2,
  INVOICED = 3,
  VOIDED = 4,
  PAYMENT_PENDING = 5,
}

export enum NeweggOrderType {
  /** The default */
  All = 0,
  /** Shipped by Newegg */
  SBN = 1,
  /** Shipped by Seller */
  SBS = 2,
  MULTI_CHANNEL = 3,
  NWS_ORDER = 4,
}

export enum NeweggPremierOrder {
  All = 0,
  Premier = 1,
  NonPremier = 2,
}

export enum NeweggSalesChannel {
  NEWEGG_ORDER = 0,
  MULTI_CHANNEL_ORDER = 1,
  REPLACEMENT_ORDER = 2,
  NWS_ORDER = 3,
}

export enum NeweggItemStatus {
  UNSHIPPED = 0,
  SHIPPED = 1,
  CANCELLED = 3,
}

export type NeweggItemStatusName = keyof typeof NeweggItemStatus;

export type NeweggOrderStatusName = keyof typeof NeweggOrderStatus;

export type NeweggVoidSoon = 24 | 48;

export type NeweggPackageType = "Shipped" | "Unshipped";

export type NeweggShipService =
  | "Shipped By Newegg"
  | "APO/FPO – Military ONLY"
  | "Super Saver(7-14 business days)"
  | "Standard Shipping (5-7 business days)"
  | "Expedited Shipping (3-5 business days)"
  | "Two-Day Shipping(2 business days)"
  | "One-Day Shipping(Next day)"
  | "International Expedited Shipping(3-5 business days)"
  | "International Two-Day Shipping(2 business days)"
  | "International Economy Shipping(8-15 business days)"
  | "International Standard Shipping(5-7 business days)"
  | "Newegg Premier 3 Days"
  | "Newegg Premier 2 Days"
  | "Newegg Premier Next Day";

export interface NeweggGetOrdersData {
  OperationType: "GetOrderInfoRequest";
  RequestBody: NeweggGetOrdersFilters;
}

export interface NeweggGetOrdersFilters {
  PageIndex?: string;
  PageSize?: string;
  RequestCriteria: {
    OrderNumberList?: {
      OrderNumber: string[];
    };
    SellerOrderNumberList?: {
      SellerOrderNumber: string[];
    };
    Status?: NeweggOrderStatus;
    OrderDownloaded?: NeweggNumericBoolean;
    Type?: NeweggOrderType;
    VoidSoon?: NeweggVoidSoon;
    OrderDateFrom?: string;
    OrderDateTo?: string;
    CountryCode?: string;
    PremierOrder?: NeweggPremierOrder;
  };
}

export interface NeweggGetOrdersResponse {
  ResponseDate: string;
  Memo?: string;
  IsSuccess: boolean;
  OperationType: "GetOrderInfoResponse";
  SellerID: string;
  ResponseBody: NeweggGetOrdersResponseBody;
}

export interface NeweggGetOrdersResponseBody {
  PageInfo: NeweggGetOrdersPageInfo;
  OrderInfoList: NeweggOrder[];
}

export interface NeweggGetOrdersPageInfo {
  TotalCount: number;
  TotalPageCount: number;
  PageIndex: number;
  PageSize: number;
}

export interface NeweggOrder extends NeweggShippingAddress {
  SellerID: string;
  OrderNumber: number;
  SellerOrderNumber?: string;
  InvoiceNumber: number;
  OrderDownloaded: boolean;
  OrderDate: string;
  AutoVoidTime: string;
  OrderStatus: NeweggOrderStatus;
  OrderStatusDescription: NeweggOrderStatusName;
  CustomerName: string;
  CustomerPhoneNumber: string;
  CustomerEmailAddress: string;
  OnTimeShipDueDate: string;
  DeliverDueDate: string;
  ShipService: NeweggShipService;
  SignatureRequired: boolean;
  CurrencyCode: string;
  OrderItemAmount: number;
  ShippingAmount: number;
  DiscountAmount: number;
  RefundAmount: number;
  OrderTotalAmount: number;
  SalesTax: number;
  VATTotal: number;
  DutyTotal: number;
  RecyclingFeeAmount: number;
  OrderQty: number;
  IsAutoVoid: boolean;
  SalesChannel: NeweggSalesChannel;
  FulfillmentOption: NeweggItemFulfillmentOption;
  ItemInfoList: NeweggOrderItem[];
  PackageInfoList: NeweggOrderPackageInfo[];
}

export interface NeweggShippingAddress {
  ShipToFirstName: string;
  ShipToLastName: string;
  ShipToCompany: string;
  ShipToAddress1: string;
  ShipToAddress2: string;
  ShipToCityName: string;
  ShipToStateCode: string;
  ShipToZipCode: string;
  ShipToCountryCode: string;
}

export interface NeweggOrderItem {
  SellerPartNumber: string;
  NeweggItemNumber: string;
  MfrPartNumber: string;
  UPCCode: string;
  Description: string;
  OrderedQty: number;
  ShippedQty: number;
  UnitPrice: number;
  ExtendUnitPrice: number;
  ExtendShippingCharge: number;
  ExtendSalesTax: number;
  ExtendVAT?: number;
  ExtendDuty?: number;
  Status: NeweggItemStatus;
  StatusDescription: NeweggItemStatusName;
  BuyerRequestedCancel?: boolean;
  AutoRegWarranty: boolean;
}

export interface NeweggOrderPackageInfo {
  PackageType: NeweggPackageType;
  ShipCarrier: string;
  ShipeService: string;
  TrackingNumber: string;
  ShipDate: string;
  ItemInfoList: NeweggOrderPackageItem[];
}

export interface NeweggOrderPackageItem {
  SellerPartNumber: string;
  MfrPartNumber: string;
  ShippedQty: number;
  Memo?: string;
  ResponseDate?: string;
}

export interface NeweggMarkOrderDownloadedData {
  OperationType: "OrderConfirmationRequest";
  RequestBody: {
    DownloadedOrderList: {
      OrderNumber: string[];
    };
  };
}

export interface NeweggMarkOrderDownloadedResponse {
  NeweggAPIResponse: {
    IsSuccess: NeweggBoolean;
    OperationType: "OrderConfirmationResponse";
    SellerID: string;
    ResponseDate: string;
    ResponseBody: {
      RequestDate: string;
      DownloadedOrderList: {
        OrderNumber: string;
      }[];
    };
  };
}

export interface NeweggShipOrderData {
  Action: "2";
  Value: {
    Shipment: {
      Header: {
        SellerID: string;
        SONumber: number;
      };
      PackageList: {
        Package: NeweggShipOrderPackage[];
      };
    };
  };
}

export interface NeweggShipOrderPackage {
  TrackingNumber: string;
  ShipCarrier: string;
  ShipService: string;
  ItemList: {
    Item: NeweggShipOrderPackageItem[];
  };
}

export interface NeweggShipOrderPackageItem {
  SellerPartNumber: string;
  NeweggItemNumber?: string;
  ShippedQty: string;
}

export interface NeweggShipOrderResponse {
  IsSuccess: boolean;
  PackageProcessingSummary: {
    FailCount: number;
    SuccessCount: number;
    TotalPackageCount: number;
  };
  Result: {
    OrderNumber: string;
    OrderStatus: NeweggOrderStatusName;
    SellerID: string;
    Shipment: {
      PackageList: [
        {
          ItemList: [
            {
              NeweggItemNumber: string;
              SellerPartNumber: string;
              ShippedQty: number;
            },
          ];
          ProcessResult: string;
          ProcessStatus: boolean;
          ShipDate: string;
          TrackingNumber: string;
        },
      ];
    };
  };
}
