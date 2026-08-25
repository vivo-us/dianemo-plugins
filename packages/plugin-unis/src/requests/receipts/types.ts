import { UnisBaseReceipt, UnisBaseReceiptItem, UnisPaging } from "../types.js";

export interface SearchUnisReceiptsDataResponse {
  Receipts: UnisReceipt[];
  paging: UnisPaging;
}

interface UnisReceipt {
  CompanyID: string;
  CustomerID: string;
  ReferenceNo?: string;
  PONo: string;
  RC: UnisRC;
}

interface UnisRC extends UnisBaseReceipt {
  ReceivedDate: string;
  Items: UnisRCItem[];
}

interface UnisRCItem extends UnisBaseReceiptItem {
  ReceivedQuantity: number;
}
export interface UnisReceiptItem {
  Facility: string;
  "Customer #": string;
  "Reciept #": string;
  "PO #": string;
  "Ref.#": string;
  "Receipt Status": string;
  "Appointment Time": null | string;
  "In Yard Time": null | string;
  "Devanned Time": null | string;
  Carrier: string;
  "SCAC Code": string;
  "Equipment #": null | string;
  "Equipment Type": string;
  "Item ID": string;
  Description: string;
  "Short Description": string;
  Grade: null | string;
  Title: string;
  Supplier: string;
  "Lot#": null | string;
  Expected: number;
  "Expected UOM": string;
  Received: null | number;
  "Received UOM": null | string;
  "Expected Pallets": null | number;
  "Received Pallets": number;
  "Units/pallet": null | string;
  "Expected CFT": number;
  "Received CFT": number;
  "Expected Weight": number;
  "Received Weight": number;
  itemSpecId: string;
  unitId: string;
  titleId: string;
  snList: [];
  receiptId: string;
  lotNo: null | string;
  referenceNo: string;
}
