import { tryHandleRequest } from "@dianemo/plugin-kit";
import { NeweggItemUpdateType } from "../types.js";
import { submitFeed } from "../feeds/index.js";
import { neweggSubClient } from "../utils.js";
import {
  NeweggDetailedItemPricing,
  NeweggGetItemPricingData,
  NeweggGetItemPricingResponse,
  NeweggItemPriceUpdate,
  NeweggPricingFeedItemData,
  NeweggSubmitPricingFeedData,
  NeweggUpdateItemPricingData,
  NeweggUpdateItemPricingResponse,
} from "./types.js";

export const getItemPricing = async (
  clientName: string,
  data: NeweggGetItemPricingData
): Promise<NeweggDetailedItemPricing[]> => {
  const res = await tryHandleRequest<NeweggGetItemPricingResponse>(
    {
      clientName: neweggSubClient(clientName, "getItemPricing"),
      requestName: "newegg.pricing.get",
      url: `/contentmgmt/item/international/price`,
      method: "PUT",
      data,
    },
    "NWG_0011",
    "Failed to get Newegg item pricing"
  );
  return res.data.PriceList;
};

export const submitPricingFeed = async (
  clientName: string,
  pricing: NeweggPricingFeedItemData[]
) => {
  const data: NeweggSubmitPricingFeedData = {
    NeweggEnvelope: {
      Header: { DocumentVersion: "2.0" },
      MessageType: "Price",
      Message: { Price: pricing },
    },
  };
  return await submitFeed(clientName, "PRICE_DATA", data);
};

export const updateItemPricing = async (
  clientName: string,
  sku: string,
  pricing: NeweggItemPriceUpdate[]
): Promise<NeweggUpdateItemPricingResponse> => {
  const data: NeweggUpdateItemPricingData = {
    Type: NeweggItemUpdateType.SellerPartNumber,
    Value: sku,
    PriceList: { Price: pricing },
  };
  const res = await tryHandleRequest<NeweggUpdateItemPricingResponse>(
    {
      clientName: neweggSubClient(clientName, "updateItemPricing"),
      requestName: "newegg.pricing.update",
      url: `/contentmgmt/item/international/price`,
      method: "POST",
      data,
    },
    "NWG_0012",
    "Failed to update Newegg item pricing"
  );
  return res.data;
};
