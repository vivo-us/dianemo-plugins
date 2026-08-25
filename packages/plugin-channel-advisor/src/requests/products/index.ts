import handleQueryOptions from "../handleQueryOptions.js";
import { CAResult, CAResultList } from "../types.js";
import handleCaRequest from "../handleCaRequest.js";
import {
  CreateProductAliasData,
  GetProductsOptions,
  GetProductOptions,
  CreateProduct,
  UpdateProduct,
  GetProduct,
} from "./types.js";

export const getProducts = async (
  clientName: string,
  options?: GetProductsOptions
): Promise<CAResultList<GetProduct>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<GetProduct>>(
    {
      clientName,
      requestName: "channelAdvisor.products.list",
      method: "GET",
      url: `/v1/Products${query}`,
    },
    "CHA_0031",
    "Failed to fetch Channel Advisor products"
  );
  return res.data;
};

export const getProduct = async (
  clientName: string,
  productId: number,
  options?: GetProductOptions
): Promise<CAResult<GetProduct>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<GetProduct>>(
    {
      clientName,
      requestName: "channelAdvisor.products.get",
      method: "GET",
      url: `/v1/Products(${productId})${query}`,
    },
    "CHA_0032",
    "Failed to fetch Channel Advisor product"
  );
  return res.data;
};

export const createProductAlias = async (
  clientName: string,
  data: CreateProductAliasData
): Promise<GetProduct> => {
  const res = await handleCaRequest<GetProduct>(
    {
      clientName,
      requestName: "channelAdvisor.products.createAlias",
      method: "POST",
      url: "/v1/Products",
      data,
    },
    "CHA_0033",
    "Failed to create Channel Advisor product alias"
  );
  return res.data;
};

export const createProduct = async (
  clientName: string,
  data: CreateProduct
): Promise<GetProduct> => {
  const res = await handleCaRequest<GetProduct>(
    {
      clientName,
      requestName: "channelAdvisor.products.create",
      method: "POST",
      url: "/v1/Products",
      data,
    },
    "CHA_0034",
    "Failed to create Channel Advisor product"
  );
  return res.data;
};

export const updateProduct = async (
  clientName: string,
  productId: number,
  data: UpdateProduct
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.products.update",
      method: "PATCH",
      url: `/v1/Products(${productId})`,
      data,
    },
    "CHA_0035",
    "Failed to update Channel Advisor product"
  );
};

export const deleteProduct = async (clientName: string, productId: number) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.products.delete",
      method: "DELETE",
      url: `/v1/Products(${productId})`,
    },
    "CHA_0036",
    "Failed to delete Channel Advisor product"
  );
};
