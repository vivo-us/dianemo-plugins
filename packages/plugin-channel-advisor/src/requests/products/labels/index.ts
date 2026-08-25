import handleQueryOptions from "../../handleQueryOptions.js";
import { CAResult, CAResultList } from "../../types.js";
import handleCaRequest from "../../handleCaRequest.js";
import { odataKey } from "../../odata.js";
import {
  GetProductLabelOptions,
  GetProductLabelsOptions,
  Label,
} from "./types.js";

export const getProductLabels = async (
  clientName: string,
  productId: number,
  options?: GetProductLabelsOptions
): Promise<CAResultList<Label>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<Label>>(
    {
      clientName,
      requestName: "channelAdvisor.productLabels.list",
      method: "GET",
      url: `/v1/Products(${productId})/Labels${query}`,
    },
    "CHA_0027",
    "Failed to fetch Channel Advisor product labels"
  );
  return res.data;
};

export const getProductLabel = async (
  clientName: string,
  productId: number,
  labelName: string,
  options?: GetProductLabelOptions
): Promise<CAResult<Label>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<Label>>(
    {
      clientName,
      requestName: "channelAdvisor.productLabels.get",
      method: "GET",
      url: `/v1/Products(${productId})/Labels('${odataKey(labelName)}')${query}`,
    },
    "CHA_0028",
    "Failed to fetch Channel Advisor product label"
  );
  return res.data;
};

export const addProductLabel = async (
  clientName: string,
  productId: number,
  labelName: string
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productLabels.add",
      method: "PATCH",
      url: `/v1/Products(${productId})/Labels('${odataKey(labelName)}')`,
      headers: {
        "Content-Type": "application/json",
      },
    },
    "CHA_0029",
    "Failed to add Channel Advisor product label"
  );
};

export const deleteProductLabel = async (
  clientName: string,
  productId: number,
  labelName: string
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productLabels.delete",
      method: "DELETE",
      url: `/v1/Products(${productId})/Labels('${odataKey(labelName)}')`,
    },
    "CHA_0030",
    "Failed to delete Channel Advisor product label"
  );
};
