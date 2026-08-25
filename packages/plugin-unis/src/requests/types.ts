type UnisUnitOfMeasure = "EA" | "CS";

interface UnisBaseSearchData {
  FacilityID: string;
  PONo?: string;
  ReferenceNo?: string;
  Paging?: {
    PageNo: number;
  };
}

export interface UnisSearchCreatedData extends UnisBaseSearchData {
  CreatedWhenFrom?: Date;
  CreatedWhenTo?: Date;
}

export interface UnisSearchUpdatedData extends UnisBaseSearchData {
  UpdatedWhenFrom?: Date;
  UpdatedWhenTo?: Date;
}

export interface UnisSearchUpdatedDataResponse<T> {
  results: {
    head: string[];
    data?: T[];
    fieldMapping: UnisFieldMapping[];
  };
  paging: UnisPaging;
}

interface UnisFieldMapping {
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

export interface UnisBaseReceipt extends UnisDynamicTextProperty {
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
}

export interface UnisBaseReceiptItem extends UnisDynamicTextProperty {
  ExpectedQty: string;
  /** You can pass in a sequance number for each ItemLine, it will be returned on the RC(Receiving Confirmation) file. Or you can leave it empty. */
  POLineNo?: number;
  /** Product Item Name, it is your unique Item SKU#. */
  ItemNumber: string;
  /** A lot number is an identification number assigned to a particular quantity or lot of material from a single manufacturer. It is used for FIFO, if you don't have it, just leave it empty */
  LotNo?: string;
  ItemNotes?: string;
  /** Unit of Measurement Supported Value: EA = Units/Each CS= Case */
  UOM: UnisUnitOfMeasure;
  /**TitleID which setup under Customer */
  TitleID?: string;
  Cartons?: UnisBaseCarton[];
}

interface UnisBaseCarton {
  CartonNo: string;
  PoundPerCarton?: number;
  ItemLines: UnisBaseCartonItem[];
}

interface UnisBaseCartonItem extends UnisDynamicTextProperty {
  /** Product Item Name, it is your unique Item SKU#. */
  ItemID: string;
  /** A lot number is an identification number assigned to a particular quantity or lot of material from a single manufacturer. */
  LotNo?: string;
  /** EA Quantity per Carton */
  QtyInCarton: number;
  /** Unit of Measurement Supported Value: EA = Units/Each CS= Case */
  UOM: UnisUnitOfMeasure;
}

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
