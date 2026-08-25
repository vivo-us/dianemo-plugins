import { tryHandleRequest } from "@dianemo/plugin-kit";
import { ExtensivListOptions } from "../types.js";
import { InventoryList } from "./types.js";

export const getInventory = async (
  clientName: string,
  options?: ExtensivListOptions
): Promise<InventoryList> => {
  const res = await tryHandleRequest<InventoryList>(
    {
      clientName,
      requestName: "extensiv.inventory.list",
      method: "GET",
      url: `/inventory`,
      params: options,
    },
    "EXT_0007",
    "Failed to fetch Extensiv inventory"
  );
  return res.data;
};
