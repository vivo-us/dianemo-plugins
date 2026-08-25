import {
  MainfreightAddress,
  MainfreightBaseOrder,
  MainfreightBaseOrderLine,
  MainfreightExternalReference,
} from "../types.js";

export enum MainfreightInboundOrderType {
  NORMAL_GRN = "N",
  CROSS_DOCK = "X",
  DAMAGED_GOODS = "D",
  OVERSEAS_RECEIPT = "O",
  TRADE_RETURNS = "R",
  WAREHOUSE_TRANSFER = "T",
}

export interface MainfreightInboundOrderData extends MainfreightBaseOrder {
  inwardReference: string;
  inwardReference1?: string;
  inwardReference2?: string;
  supplierReference?: string;
  vendorReference?: string;
  pickUp?: MainfreightAddress;
  note?: string;
  bookingDate?: Date;
  arrivalDate?: Date;
  units?: number;
  plant?: string;
  inwardType?: MainfreightInboundOrderType;
  freeStore?: string;
  connoteNumber?: string;
  inwardLines: MainfreightInboundOrderLine[];
}

interface MainfreightInboundOrderLine extends MainfreightBaseOrderLine {
  noteType?: string;
  note?: string;
  shippingNotification?: string;
  purchaseOrderNumber?: string;
  purchaseOrderLineNumber?: number;
  entryNumber?: string;
  entryLineNumber?: string;
  arrivalDate?: Date;
  vfd?: string;
  vti?: string;
  externalReferences?: MainfreightExternalReference;
}

export interface MainfreightInboundOrderResponse extends MainfreightInboundOrderData {
  id: string;
}
