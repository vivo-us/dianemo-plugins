import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { sellingPartnerIdOf } from "../clientName.js";
import { QueryData } from "../types.js";
import {
  GetListingResponse,
  ListingItemPatchRequest,
  ListingItemPatchResponse,
  SearchListingsItemsParams,
  SearchListingsItemsResponse,
} from "./types.js";

export const getListing = async (
  clientName: string,
  awsRegion: AwsRegion,
  sku: string,
  marketplaceIds: string,
  includedData?: string[]
): Promise<GetListingResponse> => {
  const res = await handleSpapiRequest<GetListingResponse>(
    clientName,
    awsRegion,
    "AMZ_0046",
    "Failed to get Amazon listing item",
    {
      endpoint: "listingsGetListingsItem",
      url: `/listings/2021-08-01/items/${sellingPartnerIdOf(clientName)}/${sku}`,
      params: { marketplaceIds, ...(includedData ? { includedData } : {}) },
    },
    "amazonSpapi.listings.getListingsItem"
  );
  return res.data;
};

export const updateListing = async (
  clientName: string,
  awsRegion: AwsRegion,
  sku: string,
  marketplaceIds: string,
  data: ListingItemPatchRequest
): Promise<ListingItemPatchResponse> => {
  const res = await handleSpapiRequest<ListingItemPatchResponse>(
    clientName,
    awsRegion,
    "AMZ_0047",
    "Failed to update Amazon listing item",
    {
      endpoint: "listingsPatchListingsItem",
      url: `/listings/2021-08-01/items/${sellingPartnerIdOf(clientName)}/${sku}`,
      params: { marketplaceIds },
      data,
    },
    "amazonSpapi.listings.patchListingsItem"
  );
  return res.data;
};

export const searchListingsItems = async (
  clientName: string,
  awsRegion: AwsRegion,
  params: SearchListingsItemsParams
): Promise<SearchListingsItemsResponse> => {
  const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {} as QueryData);

  const res = await handleSpapiRequest<SearchListingsItemsResponse>(
    clientName,
    awsRegion,
    "AMZ_0048",
    "Failed to search Amazon listings items",
    {
      endpoint: "listingsSearchListingsItems",
      url: `/listings/2021-08-01/items/${sellingPartnerIdOf(clientName)}`,
      params: queryParams,
    },
    "amazonSpapi.listings.searchListingsItems"
  );
  return res.data;
};
