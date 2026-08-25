import { tryHandleRequest } from "@dianemo/plugin-kit";
import { ExtensivListOptions } from "../types.js";
import { ItemList } from "./types.js";

export const getItems = async (
  clientName: string,
  customerId: string,
  options?: ExtensivListOptions
): Promise<ItemList> => {
  const url = `/customers/${customerId}/items`;
  const res = await tryHandleRequest<ItemList>(
    {
      clientName,
      requestName: "extensiv.items.list",
      method: "GET",
      url,
      params: options,
    },
    "EXT_0008",
    "Failed to fetch Extensiv items"
  );
  return res.data;
};
