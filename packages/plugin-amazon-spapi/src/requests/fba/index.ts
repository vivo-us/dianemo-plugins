import { AmazonGetNextPageReturnInterface } from "./types.js";
import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { QueryData } from "../types.js";

export const getFbaInventory = async (
  clientName: string,
  awsRegion: AwsRegion,
  queryData: QueryData
): Promise<AmazonGetNextPageReturnInterface> => {
  const res = await handleSpapiRequest<AmazonGetNextPageReturnInterface>(
    clientName,
    awsRegion,
    "AMZ_0007",
    "Failed to get FBA inventory summaries from Amazon",
    {
      endpoint: "fbaInventoryGetInventorySummaries",
      url: "/fba/inventory/v1/summaries",
      params: queryData,
    },
    "amazonSpapi.fba.getInventorySummaries"
  );
  return res.data;
};
