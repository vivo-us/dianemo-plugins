import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { QueryData } from "../types.js";
import {
  BaseSupplySource,
  GetSupplySourcesResponse,
  SupplySource,
} from "./types.js";

export const getSupplySources = async (
  clientName: string,
  awsRegion: AwsRegion
): Promise<BaseSupplySource[]> => {
  const locations: BaseSupplySource[] = [];

  let nextToken = null;
  do {
    const params: QueryData = { pageSize: "100" };
    if (nextToken) params.nextPageToken = nextToken;

    const res = await handleSpapiRequest<GetSupplySourcesResponse>(
      clientName,
      awsRegion,
      "AMZ_0050",
      "Failed to get Amazon supply sources",
      {
        endpoint: "supplySourcesGetSupplySources",
        url: "/supplySources/2020-07-01/supplySources",
        params,
      },
      "amazonSpapi.supplySources.getSupplySources"
    );

    const data = res.data;
    const supplySources = data.supplySources;
    locations.push(...supplySources);
    nextToken = data.nextPageToken;
  } while (nextToken);
  return locations;
};

export const getSupplySource = async (
  clientName: string,
  awsRegion: AwsRegion,
  supplySourceId: string
): Promise<SupplySource> => {
  const res = await handleSpapiRequest<SupplySource>(
    clientName,
    awsRegion,
    "AMZ_0049",
    "Failed to get Amazon supply source details",
    {
      endpoint: "supplySourcesGetSupplySource",
      url: `/supplySources/2020-07-01/supplySources/${supplySourceId}`,
    },
    "amazonSpapi.supplySources.getSupplySource"
  );
  return res.data;
};
