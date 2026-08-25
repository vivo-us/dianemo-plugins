import {
  MainfreightCode,
  MainfreightCustomerCode,
  MainfreightWarehouseCode,
} from "../types.js";

export interface MainfreightGetInventoryData {
  warehouse: MainfreightWarehouseCode[];
  customer: MainfreightCustomerCode[];
  products: MainfreightCode<string>[];
}

export interface MainfreightGetInventoryResponse {
  products: MainfreightProduct[];
}

interface MainfreightProduct extends MainfreightCode<string> {
  displayName?: string;
  balance: MainfreightProductBalance;
}

interface MainfreightProductBalance extends MainfreightInventory {
  balanceDetails: {
    balanceDetail: MainfreightProductBalanceDetails;
  }[];
}

interface MainfreightProductBalanceDetails extends MainfreightInventory {
  enteredStock: number;
  grade1?: string;
  grade2?: string;
  grade3?: string;
  expiryDate?: Date;
  vfd?: string;
  vti?: string;
  entryNo?: string;
  entryLineNo?: string;
}

interface MainfreightInventory {
  stockOnHand: number;
  committed: number;
  available: number;
  receiving: number;
  damaged: number;
  onHold: number;
  reserved: number;
  restricted: number;
  availableToOrder: number;
  held: number;
}
