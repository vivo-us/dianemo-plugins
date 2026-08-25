import { tryHandleRequest } from "@dianemo/plugin-kit";
import { NeweggItemUpdateType } from "../types.js";
import { submitFeed } from "../feeds/index.js";
import { neweggSubClient } from "../utils.js";
import {
  NeweggBusinessInventoryResponse,
  NeweggDetailedItemInventory,
  NeweggGetInventoryData,
  NeweggGetInventoryResponse,
  NeweggInventoryFeedItemData,
  NeweggItemInventory,
  NeweggSubmitInventoryFeedData,
  NeweggUpdateItemInventoryData,
  NeweggUpdateItemInventoryResponse,
} from "./types.js";

export const getItemInventory = async (
  clientName: string,
  data: NeweggGetInventoryData
): Promise<NeweggDetailedItemInventory[]> => {
  const res = await tryHandleRequest<NeweggGetInventoryResponse>(
    {
      clientName: neweggSubClient(clientName, "getItemInventory"),
      requestName: "newegg.inventory.get",
      url: `/contentmgmt/item/international/inventory`,
      method: "PUT",
      data,
    },
    "NWG_0009",
    "Failed to get Newegg item inventory"
  );
  return res.data.InventoryAllocation;
};

/**
 * Deliberately the same `getItemInventory` sub-client: it is the same logical
 * operation against the same published budget, so the two share one bucket.
 */
export const getBusinessItemInventory = async (
  clientName: string,
  data: NeweggGetInventoryData
): Promise<NeweggBusinessInventoryResponse> => {
  const res = await tryHandleRequest<NeweggBusinessInventoryResponse>(
    {
      clientName: neweggSubClient(clientName, "getItemInventory"),
      requestName: "newegg.inventory.getBusiness",
      url: `/contentmgmt/item/inventory`,
      method: "POST",
      params: { version: 304 },
      data,
    },
    "NWG_0014",
    "Failed to get Newegg business item inventory"
  );
  return res.data;
};

export const submitInventoryFeed = async (
  clientName: string,
  inventory: NeweggInventoryFeedItemData[]
) => {
  const data: NeweggSubmitInventoryFeedData = {
    NeweggEnvelope: {
      Header: { DocumentVersion: "2.0" },
      MessageType: "Inventory",
      Message: { Inventory: { Item: inventory } },
    },
  };
  return await submitFeed(clientName, "INVENTORY_DATA", data);
};

export const updateItemInventory = async (
  clientName: string,
  sku: string,
  inventory: NeweggItemInventory[]
): Promise<NeweggUpdateItemInventoryResponse> => {
  const data: NeweggUpdateItemInventoryData = {
    Type: NeweggItemUpdateType.SellerPartNumber,
    Value: sku,
    InventoryList: { Inventory: inventory },
  };
  const res = await tryHandleRequest<NeweggUpdateItemInventoryResponse>(
    {
      clientName: neweggSubClient(clientName, "updateItemInventory"),
      requestName: "newegg.inventory.update",
      url: `/contentmgmt/item/international/inventory`,
      method: "POST",
      data,
    },
    "NWG_0010",
    "Failed to update Newegg item inventory"
  );
  return res.data;
};
