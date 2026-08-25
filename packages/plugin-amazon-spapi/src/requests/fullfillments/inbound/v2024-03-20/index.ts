import { GetInboundPlanResponse, GetInboundPlansResponse } from "./types.js";
import { AwsRegion } from "../../../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../../../handleSpapiRequest.js";

export const getInboundPlans = async (
  clientName: string,
  awsRegion: AwsRegion,
  queryOptions?: {
    pageSize?: string;
    paginationToken?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }
): Promise<GetInboundPlansResponse> => {
  const res = await handleSpapiRequest<GetInboundPlansResponse>(
    clientName,
    awsRegion,
    "AMZ_0063",
    "Failed to get Amazon FBA inbound plans",
    {
      endpoint: "inboundListInboundPlans",
      url: `/inbound/fba/2024-03-20/inboundPlans`,
      params: queryOptions,
    },
    "amazonSpapi.inbound.getInboundPlans"
  );
  return res.data;
};

export const getInboundPlan = async (
  clientName: string,
  awsRegion: AwsRegion,
  inboundPlanId: string
): Promise<GetInboundPlanResponse> => {
  const res = await handleSpapiRequest<GetInboundPlanResponse>(
    clientName,
    awsRegion,
    "AMZ_0064",
    "Failed to get Amazon FBA inbound plan details",
    {
      endpoint: "inboundGetInboundPlan",
      url: `/inbound/fba/2024-03-20/inboundPlans/${inboundPlanId}`,
    },
    "amazonSpapi.inbound.getInboundPlan"
  );
  return res.data;
};

export const getInboundPlanItems = async (
  clientName: string,
  awsRegion: AwsRegion,
  inboundPlanId: string
): Promise<GetInboundPlanResponse> => {
  const res = await handleSpapiRequest<GetInboundPlanResponse>(
    clientName,
    awsRegion,
    "AMZ_0065",
    "Failed to get Amazon FBA inbound plan items",
    {
      endpoint: "inboundListInboundPlanItems",
      url: `/inbound/fba/2024-03-20/inboundPlans/${inboundPlanId}/items`,
    },
    "amazonSpapi.inbound.listInboundPlanItems"
  );
  return res.data;
};
