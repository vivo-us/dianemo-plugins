type UnisReceiptType =
  | "Regular Receipt"
  | "Title Transfer Receipt"
  | "Migo Transfer Receipt"
  | "Sales Return"
  | "Transload"
  | "Assembly";

type UnisReceiptActionCode = "Imported" | "Cancelled";

type UnisUnitOfMeasure = "EA" | "CS";

interface UnisDynamicTextProperty {
  DynTxtPropertyValue01?: string;
  DynTxtPropertyValue02?: string;
  DynTxtPropertyValue03?: string;
  DynTxtPropertyValue04?: string;
  DynTxtPropertyValue05?: string;
  DynTxtPropertyValue06?: string;
  DynTxtPropertyValue07?: string;
  DynTxtPropertyValue08?: string;
  DynTxtPropertyValue09?: string;
  DynTxtPropertyValue10?: string;
  DynTxtPropertyValue11?: string;
  DynTxtPropertyValue12?: string;
  DynTxtPropertyValue13?: string;
  DynTxtPropertyValue14?: string;
  DynTxtPropertyValue15?: string;
  DynTxtPropertyValue16?: string;
  DynTxtPropertyValue17?: string;
  DynTxtPropertyValue18?: string;
  DynTxtPropertyValue19?: string;
  DynTxtPropertyValue20?: string;
}

export interface UnisCreateInboundOrderData {
  FacilityID: string;
  /** TitleID which setup under Customer */
  TitleID?: string;
  ASNContent: UnisASNContent;
}

interface UnisASNContent extends UnisDynamicTextProperty {
  /** Defaults to Regular Receipt */
  ReceiptType?: UnisReceiptType;
  /** A party that supplies goods. If you did not set multiple suppliers with UNIS, you can ignore this field. */
  SupplierID?: string;
  /** Inbound Purchase Order Number, which is a uniquely identifies a purchase order and is generally defined by the buyer */
  PONo: string;
  /** Unique identifier, indicate an order. */
  ReferenceNo?: string;
  /** The bill of lading (BOL) works as a receipt of freight services, a contract between a freight carrier and shipper and a document of title. */
  BOLNo?: string;
  ContainerNo?: string;
  /** Container Seals */
  Seals?: string;
  /** Carrier Name, it is required if SCACCode is empty */
  CarrierName?: string;
  /** It is a privately controlled US code used to identify vessel operating common carriers (VOCC). It is typically two to four letters long */
  SCACCode?: string;
  /** Example: "5/18/2020 12:00:00 AM" */
  ScheduledDate?: string;
  ShippingInstruction?: string;
  /** Indicates whether you want to create a new order or cancel an order.
   *
   * Supported Values:
   * - Hardcode "Imported" -- to create a new order or update an existing order which status is Imported;
   * - Hardcode "Cancelled" -- to Cancelled an existing order which status is Imported.
   *
   * If the order status is not imported, you will received error message and will need to contact operation CSR to help cancel in WISE internal portal. */
  ActionCode?: UnisReceiptActionCode;
  /** The estimated time of departure is the projection of time that is expected for a transport system to depart its point of origin/location. */
  ETD?: string;
  Items: UnisCreateInboundOrderItemData[];
  /** Indicates to create a new order.
   * Supported Value:
   * - "Imported"：to create a new order or update an existing order which status is Imported or Open;
   */
  Status?: "Imported";
}

export interface UnisCreateInboundOrderItemData extends UnisDynamicTextProperty {
  /** You can pass in a sequance number for each ItemLine, it will be returned on the RC(Receiving Confirmation) file. Or you can leave it empty. */
  POLineNo?: number;
  /** Product Item Name, it is your unique Item SKU#. */
  ItemNumber: string;
  ExpectedQty: string;
  /** It is a selection list, provided by UNIS. You can leave it empty. */
  PalletSizeID?: string;
  /** A lot number is an identification number assigned to a particular quantity or lot of material from a single manufacturer. It is used for FIFO, if you don't have it, just leave it empty */
  LotNo?: string;
  /** Expected pallet quantity to receive */
  Pallets?: number;
  ItemNotes?: string;
  /** Unit of Measurement Supported Value: EA = Units/Each CS= Case */
  UOM: UnisUnitOfMeasure;
  /** Supported Value: 1-100 100 is the highest priority level. */
  ReceivingPriority?: number;
  /** Goods type which defined by customer */
  GoodsType?: string;
  /**TitleID which setup under Customer */
  TitleID?: string;
  Cartons?: UnisCreateInboundOrderItemCartonData[];
}

interface UnisCreateInboundOrderItemCartonData {
  CartonNo: string;
  PoundPerCarton?: number;
  ItemLines: UnisCreateInboundOrderItemCartonItemData[];
}

interface UnisCreateInboundOrderItemCartonItemData extends UnisDynamicTextProperty {
  /** Product Item Name, it is your unique Item SKU#. */
  ItemID: string;
  /** A lot number is an identification number assigned to a particular quantity or lot of material from a single manufacturer. */
  LotNo?: string;
  /** EA Quantity per Carton */
  QtyInCarton: number;
  /** Unit of Measurement Supported Value: EA = Units/Each CS= Case */
  UOM: UnisUnitOfMeasure;
}

export interface CreateUnisInboundOrderResponse {
  Receipts: {
    CustomerID: string;
    PONo: string;
    ReferenceNo: string | null;
    WISEPOID: string;
    Status: string;
    Error: string | null;
  }[];
}

export interface InboundOrderHeadLevel {
  Facility: string;
  Customer: string;
  "Receipt #": string;
  Status: string;
  Rush: null | boolean;
  Title: string;
  "PO #": string;
  "Ref.#": string;
  Carrier: string;
  "Container No": null | string;
  BOL: null | string;
  "Tracking No": null | string;
  "SCAC Code": string;
  "Appointment Time": string;
  "In Yard Time": string;
  "Dock Check In Time": string;
  "Dock Check Out Time": string;
  "Devanned Date": string;
  "Equipment Type": string;
  "Received Time": null | string;
  "Received Date": null | string;
  "Shipping Instruction": null | string;
  InvoiceNo: "";
  "Receipt Dynamic Property": null | string;
  Source: "PUBLIC_API";
  "Create Time": string;
  "Update Time": string;
  "Schedule Date": null | string;
  titleId: string;
  receiptId: string;
  referenceNo: string;
  allAssociatedFileId: null | string;
  shippingMethod: string;
  videos: unknown[];
}

export interface CancelUnisInboundOrderData {
  FacilityID: string;
  PONo?: string;
  ReferenceNo?: string;
  CancelNote?: string;
}
