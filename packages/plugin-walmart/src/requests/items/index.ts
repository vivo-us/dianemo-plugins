import { GetItemsParams, ItemsResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const getItems = async (clientName: string, params: GetItemsParams) => {
  const res = await tryHandleRequest<ItemsResponse>(
    {
      clientName,
      requestName: "walmart.items.list",
      url: `/v3/items`,
      method: "GET",
      params,
    },
    "WMT_0018",
    "Failed to fetch Walmart items"
  );
  return res.data;
};
