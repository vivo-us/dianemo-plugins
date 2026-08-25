import handleQueryOptions from "../../handleQueryOptions.js";
import handleCaRequest from "../../handleCaRequest.js";
import { CAResultList } from "../../types.js";
import {
  DCQuantity,
  GetProductDcQuantitiesOptions,
  UpdateProductDcQuantitiesData,
} from "./types.js";

export const getProductDcQuantities = async (
  clientName: string,
  productId: number,
  options?: GetProductDcQuantitiesOptions
): Promise<CAResultList<DCQuantity>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<DCQuantity>>(
    {
      clientName,
      requestName: "channelAdvisor.dcQuantities.list",
      method: "GET",
      url: `/v1/Products(${productId})/DCQuantities${query}`,
    },
    "CHA_0018",
    "Failed to fetch Channel Advisor product distribution center quantities"
  );
  return res.data;
};

export const updateProductDcQuantities = async (
  clientName: string,
  productId: number,
  data: UpdateProductDcQuantitiesData
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.dcQuantities.update",
      method: "POST",
      url: `/v1/Products(${productId})/UpdateQuantity`,
      data: { Value: data },
    },
    "CHA_0019",
    "Failed to update Channel Advisor product distribution center quantities"
  );
};

export const updateProductDcQuantitiesToInfinite = async (
  clientName: string,
  productId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.dcQuantities.setInfinite",
      method: "PATCH",
      url: `/v1/Products(${productId})`,
      data: { InfiniteQuantity: true },
    },
    "CHA_0020",
    "Failed to set Channel Advisor product distribution center quantity to infinite"
  );
};

export const deleteProductDcQuantities = async (
  clientName: string,
  productId: number,
  dcId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.dcQuantities.delete",
      method: "DELETE",
      url: `/v1/Products(${productId})/DCQuantities(${dcId})`,
    },
    "CHA_0021",
    "Failed to delete Channel Advisor product distribution center quantities"
  );
};
