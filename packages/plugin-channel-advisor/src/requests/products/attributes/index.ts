import handleQueryOptions from "../../handleQueryOptions.js";
import { CAResult, CAResultList } from "../../types.js";
import handleCaRequest from "../../handleCaRequest.js";
import { odataKey } from "../../odata.js";
import {
  Attribute,
  CreateUpdateProductAttributesData,
  GetProductAttributeOptions,
  GetProductAttributesOptions,
} from "./types.js";

export const getProductAttributes = async (
  clientName: string,
  productId: number,
  options?: GetProductAttributesOptions
): Promise<CAResultList<Attribute>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<Attribute>>(
    {
      clientName,
      requestName: "channelAdvisor.productAttributes.list",
      method: "GET",
      url: `/v1/Products(${productId})/Attributes${query}`,
    },
    "CHA_0007",
    "Failed to fetch Channel Advisor product attributes"
  );
  return res.data;
};

export const getProductAttribute = async (
  clientName: string,
  productId: number,
  attributeName: string,
  options?: GetProductAttributeOptions
): Promise<CAResult<Attribute>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<Attribute>>(
    {
      clientName,
      requestName: "channelAdvisor.productAttributes.get",
      method: "GET",
      url: `/v1/Products(${productId})/Attributes('${odataKey(attributeName)}')${query}`,
    },
    "CHA_0008",
    "Failed to fetch Channel Advisor product attribute"
  );
  return res.data;
};

export const createUpdateProductAttributes = async (
  clientName: string,
  productId: number,
  data: CreateUpdateProductAttributesData
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productAttributes.upsert",
      method: "POST",
      url: `/v1/Products(${productId})/UpdateAttributes`,
      data,
    },
    "CHA_0009",
    "Failed to create or update Channel Advisor product attributes"
  );
};

export const deleteProductAttribute = async (
  clientName: string,
  productId: number,
  attributeName: string
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productAttributes.delete",
      method: "DELETE",
      url: `/v1/Products(${productId})/Attributes('${odataKey(attributeName)}')`,
    },
    "CHA_0010",
    "Failed to delete Channel Advisor product attribute"
  );
};
