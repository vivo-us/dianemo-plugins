import handleQueryOptions from "../../handleQueryOptions.js";
import { CAResult, CAResultList } from "../../types.js";
import handleCaRequest from "../../handleCaRequest.js";
import {
  BundleComponent,
  GetAllProductBundleComponentsOptions,
  GetProductBundeComponentsOptions,
  UpdateComponentQuantityOnProductBundleData,
} from "./types.js";

export const getAllProductBundleComponents = async (
  clientName: string,
  options?: GetAllProductBundleComponentsOptions
): Promise<CAResultList<BundleComponent>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<BundleComponent>>(
    {
      clientName,
      requestName: "channelAdvisor.bundleComponents.listAll",
      method: "GET",
      url: `/v1/ProductBundleComponents${query}`,
    },
    "CHA_0011",
    "Failed to fetch all Channel Advisor product bundle components"
  );
  return res.data;
};

export const getProductBundleComponents = async (
  clientName: string,
  productId: number,
  options?: GetAllProductBundleComponentsOptions
): Promise<CAResultList<BundleComponent>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<BundleComponent>>(
    {
      clientName,
      requestName: "channelAdvisor.bundleComponents.listForProduct",
      method: "GET",
      url: `/v1/Products(${productId})/BundleComponents${query}`,
    },
    "CHA_0012",
    "Failed to fetch Channel Advisor product bundle components"
  );
  return res.data;
};

export const getProductBundleComponent = async (
  clientName: string,
  productId: number,
  componentId: number,
  options?: GetProductBundeComponentsOptions
): Promise<CAResult<BundleComponent>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<BundleComponent>>(
    {
      clientName,
      requestName: "channelAdvisor.bundleComponents.get",
      method: "GET",
      url: `/v1/Products(${productId})/BundleComponents(${componentId})${query}`,
    },
    "CHA_0013",
    "Failed to fetch Channel Advisor product bundle component"
  );
  return res.data;
};

export const createComponentOnProductBundle = async (
  clientName: string,
  data: BundleComponent
): Promise<CAResult<BundleComponent>> => {
  const res = await handleCaRequest<CAResult<BundleComponent>>(
    {
      clientName,
      requestName: "channelAdvisor.bundleComponents.create",
      method: "POST",
      url: `/v1/ProductBundleComponents`,
      data: data,
    },
    "CHA_0014",
    "Failed to create Channel Advisor product bundle component"
  );
  return res.data;
};

export const updateComponentQuantityOnProductBundle = async (
  clientName: string,
  data: UpdateComponentQuantityOnProductBundleData
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.bundleComponents.updateQuantity",
      method: "PATCH",
      url: `/v1/Products(${data.productId})/BundleComponents(${data.componentId})`,
      data: { Quantity: data.quantity },
    },
    "CHA_0015",
    "Failed to update Channel Advisor product bundle component quantity"
  );
};

export const deleteProductBundleComponent = async (
  clientName: string,
  productId: number,
  componentId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.bundleComponents.delete",
      method: "DELETE",
      url: `/v1/Products(${productId})/BundleComponents(${componentId})`,
    },
    "CHA_0016",
    "Failed to delete Channel Advisor product bundle component"
  );
};
