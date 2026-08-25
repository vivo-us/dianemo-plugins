import handleQueryOptions from "../../handleQueryOptions.js";
import { CAResult, CAResultList } from "../../types.js";
import handleCaRequest from "../../handleCaRequest.js";
import { odataKey } from "../../odata.js";
import {
  GetAllProductImagesOptions,
  GetProductImageOptions,
  Image,
} from "./types.js";

export const getAllProductImages = async (
  clientName: string,
  options?: GetAllProductImagesOptions
): Promise<CAResultList<Image>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<Image>>(
    {
      clientName,
      requestName: "channelAdvisor.productImages.listAll",
      method: "GET",
      url: `/v1/Images${query}`,
    },
    "CHA_0022",
    "Failed to fetch all Channel Advisor product images"
  );
  return res.data;
};

export const getProductImages = async (
  clientName: string,
  productId: number,
  options?: GetAllProductImagesOptions
): Promise<CAResultList<Image>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<Image>>(
    {
      clientName,
      requestName: "channelAdvisor.productImages.listForProduct",
      method: "GET",
      url: `/v1/Products(${productId})/Images${query}`,
    },
    "CHA_0023",
    "Failed to fetch Channel Advisor product images"
  );
  return res.data;
};

export const getProductImage = async (
  clientName: string,
  productId: number,
  placementName: string,
  options?: GetProductImageOptions
): Promise<CAResult<Image>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<Image>>(
    {
      clientName,
      requestName: "channelAdvisor.productImages.get",
      method: "GET",
      url: `/v1/Products(${productId})/Images('${odataKey(placementName)}')${query}`,
    },
    "CHA_0024",
    "Failed to fetch Channel Advisor product image"
  );
  return res.data;
};

export const createUpdateProductImage = async (
  clientName: string,
  productId: number,
  placementName: string,
  url: string
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productImages.upsert",
      method: "PATCH",
      url: `/v1/Products(${productId})/Images('${odataKey(placementName)}')`,
      data: {
        Url: url,
      },
    },
    "CHA_0025",
    "Failed to create or update Channel Advisor product image"
  );
};

export const deleteProductImage = async (
  clientName: string,
  productId: number,
  placementName: string
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productImages.delete",
      method: "DELETE",
      url: `/v1/Products(${productId})/Images('${odataKey(placementName)}')`,
    },
    "CHA_0026",
    "Failed to delete Channel Advisor product image"
  );
};
