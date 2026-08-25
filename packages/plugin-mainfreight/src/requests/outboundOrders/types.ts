import {
  MainfreightAddress,
  MainfreightBaseOrderLine,
  MainfreightCode,
  MainfreightCustomerCode,
  MainfreightExternalReference,
  MainfreightWarehouseCode,
} from "../types.js";

export enum MainfreightOrderType {
  NORMAL_ORDER = "N",
  /** Transfer stock between internal Warehouses */
  TRANSFER = "I",
  /** Order to dispose of expired stock in the system */
  DISPOSE = "D",
  /** Export or Overseas Order */
  OVERSEAS = "O",
}

export interface MainfreightOutboundOrderData {
  orderReference: string;
  customerOrderReference?: string;
  receiverReference?: string;
  crossDocReference?: string;
  warehouse: MainfreightWarehouseCode;
  customer: MainfreightCustomerCode;
  receiverGroup?: MainfreightCode<string>;
  receiver: MainfreightAddress;
  soldTo?: MainfreightContactAddress;
  charge?: MainfreightCode<string>;
  sender?: MainfreightCode<string>;
  consigneeDeliveryLocation?: MainfreightCode<string>;
  deliveryInstructions?: string;
  comment1?: string;
  comment2?: string;
  comment3?: string;
  serviceProvider?: {
    name: string;
  };
  orderType?: MainfreightOrderType;
  repCode?: string;
  repName?: string;
  requiredDate: string; // yyyy-MM-dd format
  etaDate?: string; // yyyy-MM-dd format
  miscChargeAmount?: number;
  freightCharge?: number;
  taxAmount?: number;
  invoicedNetAmount?: number;
  vipEmailAddress?: string;
  customStockStatusCode?: string;
  urgent?: boolean;
  dutyFree?: boolean;
  timesLotRequired?: boolean;
  booking?: {
    fromDateTime: string; // ex. "2021-06-02 11:11:00"
    toDateTime: string; //ex. "2021-06-02 11:11:00"
    reference: string;
    comment?: string;
  };
  serviceLevel?: string;
  callRequired?: boolean;
  externalReferences?: MainfreightExternalReference;
  orderLines: MainfreightOutboundOrderLine[];
}

interface MainfreightContactAddress extends MainfreightAddress {
  contact: string;
}

export interface MainfreightOutboundOrderLine extends MainfreightBaseOrderLine {
  backOrderUnits?: number;
  retailPrice?: number;
  discountPrice?: number;
  costPrice?: number;
  extendedPrice?: number;
  miscCharge?: {
    description: string;
    amount: number;
  };
  receiverStock?: MainfreightCode<string>;
  contingencyPrice?: number;
  freightClass?: string;
  note?: MainfreightExternalReference;
}

export interface MainfreightOutboundOrderResponse extends MainfreightOutboundOrderData {
  id: string;
}
