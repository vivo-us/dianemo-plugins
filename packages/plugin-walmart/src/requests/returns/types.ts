export interface GetWalmartReturnsData {
  filters?: WalmartReturnQueryParameters;
  nextCursor?: string;
}

export interface WalmartReturnQueryParameters {
  returnOrderId?: string;
  customerOrderId?: string;
  status?: WalmartReturnStatus;
  replacementInfo?: string;
  returnType?: "REPLACEMENT" | "REFUND";
  returnCreationStartDate?: Date; // based on UTC, ISO 8601. Date example: '2013-08-16' Timestamp example: '2013-08-16T10:30:15Z'
  returnCreationEndDate?: Date; // based on UTC, ISO 8601. Date example: '2013-08-16' Timestamp example: '2013-08-16T10:30:15Z'
  returnLastModifiedStartDate?: Date; // based on UTC, ISO 8601. Date example: '2013-08-16' Timestamp example: '2013-08-16T10:30:15Z'
  returnLastModifiedEndDate?: Date; // based on UTC, ISO 8601. Date example: '2013-08-16' Timestamp example: '2013-08-16T10:30:15Z'
  limit?: number;
}

export interface WalmartReturn {
  meta: WalmartReturnMetaData;
  returnOrders: WalmartReturnOrder[];
}

interface WalmartReturnMetaData {
  totalCount: number;
  limit: number;
  nextCursor: string;
}

export interface WalmartReturnOrder {
  returnOrderId: string;
  customerEmailId: string;
  returnType: "REPLACEMENT" | "REFUND";
  replacementCustomerOrderId: string;
  customerName: {
    firstName: string;
    lastName: string;
  };
  customerOrderId: string;
  returnOrderDate: string;
  returnByDate: string;
  refundMode: string;
  totalRefundAmount: WalmartMoneyType;
  returnLineGroups: {
    groupNo: number;
    returnLines: {
      returnOrderLineNumber: number;
    }[];

    labels: {
      labelImageURL: string;
      carrierInfoList?: {
        carrierId: string;
        carrierName: string;
        serviceType: string;
        trackingNo: string;
      }[];
    }[];
    returnExpectedFlag: boolean; // is the customer required to return this to return center
  }[];
  returnOrderLines: {
    returnOrderLineNumber: number;
    salesOrderLineNumber: number;
    sellerOrderId: number;
    returnReason: WalmartReturnReason;
    purchaseOrderId: string;
    purchaseOrderLineNumber: number;
    exceptionItemType: string;
    isReturnForException: boolean;
    rechargeReason: string;
    returnCancellationReason: string;
    item: {
      sku: string;
      condition: string;
      productName: string;
      itemWeight: WalmartMeasurementType;
    };
    charges: {
      chargeCategory: string;
      chargeName: string;
      chargePerUnit: WalmartMoneyType;
      isDiscount: boolean;
      isBillable: boolean;
      tax: {
        taxName: string;
        excessTax: WalmartMoneyType;
        taxPerUnit: WalmartMoneyType;
      }[];
      excessCharge: WalmartMoneyType;
      references: WalmartReference<string, string>[];
    }[];
    unitPrice: WalmartMoneyType;
    itemReturnSettings: WalmartReference<string, string>[];
    chargeTotals: WalmartReference<WalmartChargeTotalsType, WalmartMoneyType>[];
    cancellableQty: number;
    quantity: WalmartMeasurementType;
    returnExpectedFlag: boolean;
    isFastReplacement: boolean;
    isKeepIt: boolean;
    lastItem: boolean;
    refundedQty: number;
    rechargeableQty: number;
    refundChannel: WalmartRefundChannel;
    returnTrackingDetail: {
      sequenceNo: number;
      eventTag: WalmartReturnEventTags;
      eventDescription: string;
      eventTime: string;
      references: WalmartReference<string, string>[];
    }[];
    status: WalmartReturnStatus;
    statusTime: string;
    currentDeliveryStatus: string;
    currentRefundStatus: string;
    currentTrackingStatuses: {
      status: WalmartReturnStatus;
      statusTime: string;
      currentRefundStatus: string;
      quantity: WalmartMeasurementType;
    }[];
  }[];
  returnChannel: {
    channelName: string;
    quantity: WalmartMeasurementType;
  };
}

interface WalmartMoneyType {
  currencyAmount: number;
  currencyUnit: string;
}

interface WalmartReference<X, T> {
  name: X;
  value: T;
}

interface WalmartMeasurementType {
  unitOfMeasure: string;
  measurementValue: number;
}

type WalmartChargeTotalsType =
  | "lineUnitPrice"
  | "lineProductTaxes"
  | "lineTotalTaxes"
  | "lineSubTotal"
  | "lineTotal";

type WalmartReturnReason =
  | "ARRIVED_LATE"
  | "AUTO_RETURN"
  | "BOUGHT_ANOTHER_SIZE_OR_COLOR"
  | "BOUGHT_SOMEWHERE_ELSE"
  | "DAMAGED"
  | "DEFECTIVE"
  | "DUPLICATE_ITEM"
  | "INADEQUATE_QUALITY"
  | "INCORRECT_ITEM"
  | "LOST_AFTER_DELIVERY"
  | "LOST_IN_TRANSIT"
  | "LOWER_PRICE"
  | "MISSING_PARTS"
  | "NOT_AS_DESCRIBED"
  | "NO_LONGER_WANTED"
  | "RETURN_TO_SENDER"
  | "SHIPPING_BOX_DAMAGED"
  | "TRIED_TO_CANCEL"
  | "WRONG_SIZE/POOR_FIT";

type WalmartRefundChannel =
  | "WALMART_SETTLED_REFUND"
  | "SELLER_AUTO_REFUND"
  | "SELLER_MANUAL_REFUND"
  | "SELLER_SYSTEM_REFUND"
  | "WALMART_TRIGGERED_REFUND";

type WalmartReturnEventTags =
  | "RETURN_INITIATED"
  | "RETURN_IN_TRANSIT"
  | "DELIVERED_AT_RETURN_CENTER"
  | "REFUND_INITIATED"
  | "REFUND_ISSUED"
  | "RETURN_CANCELLED"
  | "INTRANSIT_AFTER_INVOICE"
  | "DELIVERED_AFTER_INVOICE";

export type WalmartReturnStatus = "INITIATED" | "DELIVERED" | "COMPLETED";
