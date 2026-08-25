import { WayfairGraphQLData } from "../types.js";

export interface WayfairInventoryData {
  inventory: WayfairInventory[];
}

export type GetWayfairInventoryResponse =
  WayfairGraphQLData<WayfairInventoryData>;

interface WayfairInventory {
  supplierPartNumber: string;
  quantityOnHand: number;
  quantityBackordered: number;
  quantityOnOrder: number;
  discontinued: boolean;
}
