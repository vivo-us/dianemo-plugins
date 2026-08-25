import { tryHandleRequest } from "@dianemo/plugin-kit";
import { submitFeed } from "../feeds/index.js";
import {
  UpdatePriceData,
  UpdatePriceResponse,
  WalmartPriceFeed,
} from "./types.js";

/**
 * Sends a bare object, taking `submitFeed`'s JSON branch. Feed content types are
 * per-feed, not uniform, and multipart is the wrong guess here — see
 * docs/walmart-api.md#feed-content-types-are-not-uniform-across-feed-types.
 */
export const submitPriceFeed = async (
  clientName: string,
  data: WalmartPriceFeed
) => {
  return submitFeed(clientName, "PRICE_AND_PROMOTION", data);
};

export const updatePrice = async (
  clientName: string,
  data: UpdatePriceData
) => {
  const res = await tryHandleRequest<UpdatePriceResponse>(
    {
      clientName,
      requestName: "walmart.pricing.update",
      url: `/v3/price`,
      method: "PUT",
      data,
    },
    "WMT_0017",
    "Failed to update Walmart price"
  );
  return res.data;
};
