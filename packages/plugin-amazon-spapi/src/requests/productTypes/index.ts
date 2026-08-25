import { GetProductTypeResponse, GetProductTypesResponse } from "./types.js";
import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { sellingPartnerIdOf } from "../clientName.js";

export const getProductTypes = async (
  clientName: string,
  awsRegion: AwsRegion,
  marketplaceIds: string,
  sku?: string
): Promise<GetProductTypesResponse> => {
  const res = await handleSpapiRequest<GetProductTypesResponse>(
    clientName,
    awsRegion,
    "AMZ_0070",
    "Failed to search Amazon product type definitions",
    {
      endpoint: "searchDefinitionsProductTypes",
      url: `/definitions/2020-09-01/productTypes`,
      params: { marketplaceIds, ...(sku && { itemName: sku }) },
    },
    "amazonSpapi.definitions.searchProductTypes"
  );
  return res.data;
};

export const getProductType = async (
  clientName: string,
  awsRegion: AwsRegion,
  productType: string,
  marketplaceIds: string[]
): Promise<GetProductTypeResponse> => {
  const res = await handleSpapiRequest<GetProductTypeResponse>(
    clientName,
    awsRegion,
    "AMZ_0071",
    "Failed to get Amazon product type definition",
    {
      endpoint: "getDefinitionsProductType",
      url: `/definitions/2020-09-01/productTypes/${productType}`,
      params: { marketplaceIds, sellerId: sellingPartnerIdOf(clientName) },
    },
    "amazonSpapi.definitions.getProductType"
  );
  return res.data;
};
