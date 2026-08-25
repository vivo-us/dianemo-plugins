import { tryHandleRequest } from "@dianemo/plugin-kit";
import { MainfreightRegion } from "../types.js";
import { resolveRegion } from "../utils.js";
import {
  MainfreightGetInventoryData,
  MainfreightGetInventoryResponse,
} from "./types.js";

export const getInventory = async (
  clientName: string,
  region: MainfreightRegion,
  data: MainfreightGetInventoryData
): Promise<MainfreightGetInventoryResponse> => {
  const resolvedRegion = resolveRegion(region);
  const res = await tryHandleRequest<MainfreightGetInventoryResponse>(
    {
      clientName,
      requestName: "mainfreight.inventory.get",
      method: "POST",
      url: `/Warehousing/1.1/Customers/Products/StockOnHand?region=${resolvedRegion}`,
      data,
    },
    "MFT_0008",
    "Failed to fetch Mainfreight inventory"
  );
  return res.data;
};
