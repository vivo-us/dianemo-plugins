import { CurrencyCodes } from "@dianemo/plugin-kit";

/** A Date in the YYYYMMDDHHMMSS format */
export type DateTimeString = string;

export enum UnisOrderFreightTerm {
  COLLECT = "CC",
  PREPAID = "PP",
  THIRD_PARTY = "TP",
}

export enum UnitShipMethod {
  TRUCKLOAD = "M",
  LTL = "L",
  SMALL_PARCEL = "U",
  WILL_CALL = "W",
  UNKNOWN = "NA",
}

export enum UnisOrderUOM {
  EACH = "EA",
  CASE = "CS",
}

export interface CreateUnisOrderData {
  FacilityID: string;
  TitleID?: string;
  POContent: UnisOrderPoContent;
}

export interface UnisOrderPoContent {
  /** Reference Number, Unique identifier, indicate an order. */
  ReferenceNo: string;
  /** Your customer's Purchse Order Number, doesn't need to be unique.	 */
  PONo?: string;
  /** Your Sales Order Number, doesn't need to be unique. */
  CustomerSONo?: string;
  /** Indicate a sets of orders, which submitted to UNIS system in one batch. You will be able to search the BatchNo to pull acknowledgements. */
  BatchNo?: string;
  /** The bill of lading (BOL), can be provided by you. Or UNIS will generate our own BOL# when the shipment is ready to go. */
  BOLNo?: string;
  ReferenceNo01?: string;
  /** It is usually used to indicate the shippment require for signature (empty means NOT require for signature). */
  ReferenceNo02?: string;
  ReferenceNo03?: string;
  ReferenceNo04?: string;
  ReferenceNo05?: string;
  /** Order placed date */
  OrderedDate?: DateTimeString;
  /** Scheduled shipping date */
  ScheduledDate?: DateTimeString;
  /** Order canceled date */
  CanceledDate?: DateTimeString;
  /** Ship not before datetime */
  ShipNotBefore?: DateTimeString;
  /** Ship not later than datetime */
  ShipNoLater?: DateTimeString;
  /** Must Arrive by Date */
  MABD?: DateTimeString;
  /** Apply to LTL shipments only. */
  RoutedDate?: DateTimeString;
  ReferenceDate01?: DateTimeString;
  ReferenceDate02?: DateTimeString;
  Address?: UnisAddress;
  ShippingInfo: UnisShippingInfo;
  OrderTotal?: UnisOrderTotal;
  OrderNotes?: UnisOrderNotes;
  Items: UnisOrderItem[];
  /**
   * It's for Transload Order only.
   *
   * Provide Carton Level information, only when you want UNIS operation team pick by particular CartonNo.
   */
  CTN?: UnisCTN;
  Status: "Imported";
  IncoTerm?: string;
  RetailerName?: string;
  BusinessType?: "B2B" | "B2C" | "Small Parcel";
  SubOrderType?: string;
  PackNote?: string;
  IsRush?: boolean;
  DataChannel?: string;
  DataChannelAccount?: string;
}

export interface UnisAddress {
  /** The sold-to party is the party that places the order and to whom sales and product prices are recorded against */
  SoldToName?: string;
  SoldToAddress1?: string;
  SoldToAddress2?: string;
  SoldToCity?: string;
  SoldToState?: string;
  SoldToZipCode?: string;
  SoldToCountry?: string;
  SoldToContact?: string;
  SoldToPhone?: string;
  SoldToExtension?: string;
  SoldToFax?: string;
  SoldToEmail?: string;
  ShipToName: string;
  ShipToAddress1: string;
  ShipToAddress2?: string;
  ShipToCity: string;
  ShipToState: string;
  ShipToZipCode: string;
  ShipToCountry: string;
  ShipToContact?: string;
  ShipToPhone?: string;
  ShipToExtension?: string;
  ShipToFax?: string;
  ShipToEmail?: string;
  /** If ship to retailer store, you can put the StoreNo as indicator. */
  ShipToStoreNo?: string;
  /** Apply to LTL shipments only. Issued by retailer. */
  ShipToBatchCode?: string;
  /** It is usually used to indicate the ship to address is Commercial or Residential (Yes means Residential, Empty or No means Commercial). */
  ShipToHome?: boolean;
  /** For Ship to company, etc. */
  ShipToOrganization?: string;
  StoreName?: string;
  StoreAddress1?: string;
  StoreAddress2?: string;
  StoreCity?: string;
  StoreState?: string;
  StoreZipCode?: string;
  StoreCountry?: string;
  StoreContact?: string;
  StorePhone?: string;
  StoreExtension?: string;
  StoreFax?: string;
  StoreEmail?: string;
  StoreStoreNo?: string;
  BillToName?: string;
  BillToAddress1?: string;
  BillToAddress2?: string;
  BillToCity?: string;
  BillToState?: string;
  BillToZipCode?: string;
  BillToCountry?: string;
  BillToContact?: string;
  BillToPhone?: string;
  BillToExtension?: string;
  BillToFax?: string;
  BillToEmail?: string;
  BillToStoreNo?: string;
}

export interface UnisShippingInfo {
  FreightTerm: UnisOrderFreightTerm;
  ShipMethod: UnitShipMethod;
  /** Carrier's standard service level */
  DeliveryService?: string;
  /** It is a privately controlled US code used to identify vessel operating common carriers (VOCC). It is typically two to four letters long. Apply to LTL only. */
  SCACCode?: string;
  /** Carrier's standard service level */
  CarrierName?: "FedEx" | "USPS" | "UPS" | "DHL" | "Endicia";
  /** If Freight Term is TP, the Shipping Account Number is required. */
  ShippingAccountNo?: string;
  /** Apply to LTL shipments only. */
  ContainerSize?: string;
  /** Leave it blank if no signature needed */
  SignatureType?: "ADULT" | "DIRECT" | "INDIRECT";
}

export interface UnisOrderTotal {
  /** Total Weight */
  TotalWeight?: number;
  /** Total Cubic Feet	 */
  TotalCbft?: number;
}

export interface UnisOrderNotes {
  /** Notes for Warehouse Instructions */
  Note?: string;
  /** Bill of Lading instructions, will be shown on the BOL, instruction section. */
  BOLNote?: string;
  /** Packing List Notes, will be shown on the Packing List Notes section. */
  LabelNote?: string;
  MISC01?: string;
  MISC02?: string;
  MISC03?: string;
  MISC04?: string;
  MISC05?: string;
  MISC06?: string;
  MISC07?: string;
  MISC08?: string;
  MISC09?: string;
  MISC10?: string;
  OrderType?: string;
  /** Apply to the order reqires retailer's Carton UCC or Pallet UCC labels. */
  LabelCode?: string;
  /** Will be shown on WISE order page. */
  ShippingInstructions?: string;
  /** Will be shown on WISE order page. */
  DeliveryInstructions?: string;
}

export interface UnisOrderItem {
  /** You can pass in a unique number for each ItemLine, it will be returned on the DC(Delivery Confirmation) calls. */
  LineNo?: number;
  /** A party that supplies goods. If you did not set multiple suppliers with UNIS, you can ignore this field. */
  SupplierID?: string;
  /** Your unique Item SKU */
  ItemID: string;
  /** Buyer's item ID. Usualy is retailer's model number or item number. If you don't have it, you can ignore. */
  BuyerItemID?: string;
  /** A lot number is an identification number assigned to a particular quantity or lot of material from a single manufacturer. Please only provide LotNo when you want UNIS operation team to pick by this particular LotNo. */
  LotNo?: string;
  /** The ordered qty, must be based on the value on the UOM section. */
  OrderedQty: number;
  /** Unit sales price, if you don't require EDI810 from UNIS, you can ignore. */
  UnitPrice?: number;
  /** If your channels or retailers doesn't require for particular pack Qty, you can ignore. */
  PrePackQty?: number;
  /** If your channels or retailers doesn't require for particular pack description, you can ignore */
  PrePackDescription?: string;
  PoundPerPackage?: number;
  Length?: number;
  Width?: number;
  Height?: number;
  /** Customer pallet quantity */
  CustomerPallets?: number;
  PalletWeight?: number;
  /** Notes will be shown on the order page, itemline section. */
  ItemNote?: string;
  /** UPC consists of 12 numeric digits that are uniquely assigned to each trade item. */
  UPCCode?: string;
  /** If your channels or retailers doesn't require for particular Package Configure, you can ignore. */
  PackageConfigure?: string;
  UOM?: UnisOrderUOM;
  DTLMISC01?: string;
  DTLMISC02?: string;
  DTLMISC03?: string;
  DTLMISC04?: string;
  DTLMISC05?: string;
  DTLMISC06?: string;
  DTLMISC07?: string;
  DTLMISC08?: string;
  DTLMISC09?: string;
  DTLMISC10?: string;
  DTLMISC11?: string;
  DTLMISC12?: string;
  DTLMISC13?: string;
  DTLMISC14?: string;
  DTLMISC15?: string;
  DTLMISC16?: string;
  DTLMISC17?: string;
  DTLMISC18?: string;
  DTLMISC19?: string;
  DTLMISC20?: string;
  OriginalItemProductNumber?: string;
  ReturnLabel?: boolean;
  UnitPriceCurrency?: CurrencyCodes;
  /** Goods type which defined by customer */
  GoodsType?: string;
  /** TitleID which setup under Customer */
  TitleID?: string;
}

export interface UnisCTN {
  CartonNo?: string;
  PoundPerCarton?: number;
}

export interface CreateUnisOrderResponse {
  Orders: UnisResponseOrder[];
}

export interface UnisResponseOrder {
  CustomerId: string;
  PONo?: string;
  ReferenceNo: string;
  WISEPOID: string;
  Status: "Success" | "Fail";
  Error?: string;
}

export interface CancelUnisOrderData {
  /** FacilityID indicates which warehouse UNIS ship from. It should be assigned by UNIS CSR */
  FacilityID: string;
  /** Reference Number, Unique identifier, indicate an order */
  ReferenceNo?: string;
  /** Your customer's Purchse Order Number, doesn't need to be unique. */
  PONo?: string;
  CancelNote?: string;
}

export interface CancelUnisOrderResponse {
  success: boolean;
}

export interface UploadLabelForUnisOrderData {
  FacilityID: string;
  ReferenceNo: string;
  DocumentType:
    | "BOL"
    | "Packing List"
    | `Pallet Label (4" x 6")`
    | `Shipping Label (4" x 6")`
    | `Shipping Label (4" x 8")`
    | `Shipping Label (Letter)`
    | 'UCC Label (4" x 6")';
  TrackingNo?: string;
  SubTrackingNos?: string[];
  /** BASE64 of the file */
  FileData: string;
  FileName: string;
}

export interface GetUnisOrdersData {
  FacilityID: string;
  PONo?: string;
  ReferenceNo?: string;
  UpdatedWhenFrom?: Date;
  UpdatedWhenTo?: Date;
  Paging?: {
    PageNo: number;
  };
}

export interface GetUnisOrdersDataResponse<T> {
  results: {
    head: string[];
    data?: T[];
    fieldMapping: UnisFieldMapping[];
  };
  paging: UnisPaging;
}

export interface UnisFieldMapping {
  customerField: string;
  wiseField: string;
  isDefaultField: boolean;
  isTime: boolean | null;
  timeFormat: string | null;
  writeExcelAsDateType: boolean;
}

export interface UnisPaging {
  totalCount: number;
  pageNo: number;
  totalPage: number;
  startIndex: number;
  endIndex: number;
  limit: number;
}

export interface UnisOrderItemData {
  "Item ID": string;
  "Short Description": string;
  Description: string;
  Title: string;
  "Order Qty": number;
  "Shipped Qty": number;
  UOM: string;
  "Order Weight": string;
  "Shipped Weight": string;
  "Pallet QTY": number;
  "Tracking No"?: string;
  itemSpecId: string;
  unitId: string;
  orderId: string;
  lotNo: string;
  allAssociatedFileId: null;
  referenceNo: string;
  shipMethod: string;
  shippedTime: string;
  bolNo: null;
  status: "Shipped" | string;
  isSingleQTY: boolean;
  targetCompletionDate: string;
}

export interface SearchUnisOrdersData {
  FacilityID: string;
  PONo?: string;
  ReferenceNo?: string;
  CreatedWhenFrom?: Date;
  CreatedWhenTo?: Date;
  Paging?: {
    PageNo: number;
  };
}

export interface SearchUnisOrdersDataResponse {
  Orders: UnisOrder[];
  paging: UnisPaging;
}

export interface UnisOrder {
  FacilityID: string;
  CustomerID: string;
  ReferenceNo: string;
  CreatedWhen: string;
  PONo?: string;
  DC: {
    WISECompanyID: string;
    CompanyID: string;
    FacilityID: string;
    OrderNo: string;
    CustomerID: string;
    ReferenceNo: string;
    ShippedDate?: string;
    MasterBOLNo?: string;
    PONo?: string;
    ShipToName: string;
    ShipToAddress: string;
    ShipToAddress2?: string;
    ShipToCity: string;
    ShipToState: string;
    ShipToZipcode: string;
    ShipToCountry: string;
    ShipFromAddress: string;
    ShipFromAddress2?: string;
    ShipFromCity: string;
    ShipFromState: string;
    ShipFromZipcode: string;
    ShipFromCountry: string;
    BOLNo?: string;
    LoadNo?: string;
    LoadID?: string;
    TransportationType: string;
    ShipMethod: string;
    SCACCode: string;
    CarrierID: string;
    Seals?: string;
    TotalShippedQty: number;
    TotalWeight: null;
    TotalCFT: number;
    CustomerSONo?: string;
    BatchNo?: string;
    ReferenceNo01: string;
    ReferenceNo02: string;
    ReferenceNo03?: string;
    ReferenceNo04?: string;
    ReferenceNo05?: string;
    OrderedDate?: string;
    MABD?: string;
    ReferenceDate01?: string;
    ReferenceDate02?: string;
    ShipToStoreNo?: string;
    SoldToName?: string;
    SoldToReference?: string;
    SoldToAddress1?: string;
    SoldToAddress2?: string;
    SoldToCity?: string;
    SoldToState?: string;
    SoldToZipCode?: string;
    SoldToCountry?: string;
    StoreName?: string;
    StoreAddress1?: string;
    StoreAddress2?: string;
    StoreCity?: string;
    StoreState?: string;
    StoreZipCode?: string;
    StoreCountry?: string;
    StoreNo?: string;
    StoreReference?: string;
    StoreContact?: string;
    BillToName: string;
    BillToAddress1: string;
    BillToAddress2?: string;
    BillToCity: string;
    BillToState: string;
    BillToZipCode: string;
    BillToCountry: string;
    BillToStoreNo?: string;
    FreightTerm: string;
    LabelNote?: string;
    OrderNote?: string;
    MISC01?: string;
    MISC02?: string;
    MISC03?: string;
    MISC04?: string;
    MISC05?: string;
    MISC06?: string;
    MISC07?: string;
    MISC08?: string;
    MISC09?: string;
    MISC10?: string;
    MISC11?: string;
    MISC12?: string;
    MISC13?: string;
    MISC14?: string;
    MISC15?: string;
    MISC16?: string;
    MISC17?: string;
    MISC18?: string;
    MISC19?: string;
    MISC20?: string;
    MISC21?: string;
    MISC22?: string;
    MISC23?: string;
    MISC24?: string;
    MISC25?: string;
    OriginalDynamic: Record<string, unknown>;
    LadingQty: number;
    LadingUOM: string;
    OrderType?: string;
    Items: CreatedUnisOrderItem[];
    ProcessID: string;
    DeliveryService: string;
    ShipFromFacilityID?: string;
    ShipToBatchCode?: string;
    FreightCost: number;
    AuthorizationNumber?: string;
    SubOrderType?: string;
    RetailerName: string;
    TrailerNumber?: string;
    PalletQty: number;
    LabelCode?: string;
    Status: string;
    wiseCustomerId: string;
    ShipmentTicketId: string;
    ShippingAccount: string;
    FacilityOfThirdPartySite: string;
    DataSource: string;
    ARNContent?: string;
    GateCheckInTime: null;
    GateCheckOutTime: string;
    WISEOrderType: string;
    IsRush: boolean;
    Cartons: UnisOrderCarton[];
    MaterialLines: [];
    dtsConfirmation: UnisOrderDtsConfirmation;
  };
}

export interface UnisBaseOrderItem {
  ItemNumber: string;
  ShippedQty: number;
  UOM: string;
  Weight: number | null;
  SupplierID?: string;
  EAN?: string;
  DigitBarcode14?: string;
  Description: string;
  Color?: string;
  Size?: string;
  Pack?: string;
  SizeOfEDI?: string;
  EnteredUOM: string;
  LineNo: number;
  UPC?: string;
  DTLMISC01?: string;
  DTLMISC02?: string;
  DTLMISC03?: string;
  DTLMISC04?: string;
  DTLMISC05?: string;
  DTLMISC06?: string;
  DTLMISC07?: string;
  DTLMISC08?: string;
  DTLMISC09?: string;
  DTLMISC10?: string;
  DTLMISC11?: string;
  DTLMISC12?: string;
  DTLMISC13?: string;
  DTLMISC14?: string;
  DTLMISC15?: string;
  DTLMISC16?: string;
  DTLMISC17?: string;
  DTLMISC18?: string;
  DTLMISC19?: string;
  DTLMISC20?: string;
  DTLMISC21?: string;
  DTLMISC22?: string;
  DTLMISC23?: string;
  DTLMISC24?: string;
  DTLMISC25?: string;
}

export interface CreatedUnisOrderItem extends UnisBaseOrderItem {
  OrderedQty: number;
  DifferenceQty: number;
  CFT: number;
  WeightUnitCode: string;
  TitleID: string;
  LotNo?: string;
  UnitPrice?: string;
  OriginalDynamic: object;
  MO_NUMBER: string | null;
  MO_LINE_NUMBER: string | null;
  DELIVERY_DETAIL_ID: string | null;
  SO_LINE_NUMBER: string | null;
  MO_LINE_ID: string | null;
  PalletTiHiQty: number;
  BaseUOM: string;
  ShippedBaseQty: number;
  ReturnLabel: string;
  GoodsType: string;
}

export interface UnisOrderCarton {
  CartonNo: string;
  SLP: string;
  FromLP: string;
  TrackingNo: string;
  Weight: number | null;
  Volume: number;
  PalletNo: string;
  SSCCType: string;
  ItemLines: UnisOrderCartonItem[];
  OrderNo: string;
  ShippingCost: number;
  ShippingCarrierName: string;
  ShippingServiceName: string;
  CaseHeight: number | null;
  CaseWidth: number | null;
  CaseLength: number | null;
  PalletHeight: number | null;
  PalletWidth: number | null;
  PalletLength: number | null;
  PalletSSCC: string;
  DynTxtPropertyValue01?: string;
  DynTxtPropertyValue02?: string;
  DynTxtPropertyValue03?: string;
  DynTxtPropertyValue04?: string;
  DynTxtPropertyValue05?: string;
  DynTxtPropertyValue06?: string;
  DynTxtPropertyValue07?: string;
  DynTxtPropertyValue08?: string;
  DynTxtPropertyValue09?: string;
}

export interface UnisOrderCartonItem extends UnisBaseOrderItem {
  Volume: number;
  CartonNo: string;
  OrderNo: string;
  TotalOrderedQty: number;
  TotalShippedQty: number;
  SerialNumber?: string;
  ReturnTrackingNumber?: string;
  ShippingCarrierName: string;
  ShippingServiceName: string;
  ManufactureDate?: string;
  ExpirationDate?: string;
  PalletLPN?: string;
}

export interface UnisOrderDtsConfirmation {
  CustomerId: string;
  PoNo: string;
  ReferenceNO: string;
  Accept: boolean;
  Shipment: UnisOrderDtsConfirmationShipment[];
}

export interface UnisOrderDtsConfirmationShipment {
  DeliveryDate?: string;
  ShippedDate: string;
  TrackingNO: string;
  ShipMethod: string;
  Item: UnisOrderDtsConfirmationShipmentItem[];
}

export interface UnisOrderDtsConfirmationShipmentItem {
  ItemSequenceNumber: number;
  ShippingQty: number;
  Uom: string;
  ProductId: string;
}
