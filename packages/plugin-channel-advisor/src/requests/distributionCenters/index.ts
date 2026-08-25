import handleQueryOptions from "../handleQueryOptions.js";
import { CAResult, CAResultList } from "../types.js";
import handleCaRequest from "../handleCaRequest.js";
import {
  GetDistributionCentersOptions,
  GetDistributionCenterOptions,
  CreateDistributionCenter,
  UpdateDistributionCenter,
  GetDistributionCenter,
  UpdateOperatingHours,
  Day,
} from "./types.js";

export const getDistributionCenters = async (
  clientName: string,
  options?: GetDistributionCentersOptions
): Promise<CAResultList<GetDistributionCenter>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<GetDistributionCenter>>(
    {
      clientName,
      requestName: "channelAdvisor.distributionCenters.list",
      method: "GET",
      url: `/v1/DistributionCenters${query}`,
    },
    "CHA_0037",
    "Failed to fetch Channel Advisor distribution centers"
  );
  return res.data;
};

export const getDistributionCenter = async (
  clientName: string,
  distributionCenterId: number,
  options?: GetDistributionCenterOptions
): Promise<CAResult<GetDistributionCenter>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<GetDistributionCenter>>(
    {
      clientName,
      requestName: "channelAdvisor.distributionCenters.get",
      method: "GET",
      url: `/v1/DistributionCenters(${distributionCenterId})${query}`,
    },
    "CHA_0038",
    "Failed to fetch Channel Advisor distribution center"
  );
  return res.data;
};

export const createDistributionCenter = async (
  clientName: string,
  data: CreateDistributionCenter
): Promise<CAResult<GetDistributionCenter>> => {
  const res = await handleCaRequest<CAResult<GetDistributionCenter>>(
    {
      clientName,
      requestName: "channelAdvisor.distributionCenters.create",
      method: "POST",
      url: `/v1/DistributionCenters`,
      data,
    },
    "CHA_0039",
    "Failed to create Channel Advisor distribution center"
  );
  return res.data;
};

export const updateDistributionCenter = async (
  clientName: string,
  distributionCenterId: number,
  data: UpdateDistributionCenter
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.distributionCenters.update",
      method: "PATCH",
      url: `/v1/DistributionCenters(${distributionCenterId})`,
      data,
    },
    "CHA_0040",
    "Failed to update Channel Advisor distribution center"
  );
};

export const updateOperatingHours = async (
  clientName: string,
  distributionCenterId: number,
  data: UpdateOperatingHours[]
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.distributionCenters.updateOperatingHours",
      method: "PATCH",
      url: `/v1/DistributionCenters(${distributionCenterId})/OperatingHours`,
      data,
    },
    "CHA_0041",
    "Failed to update Channel Advisor distribution center operating hours"
  );
};

export const deleteOperatingHours = async (
  clientName: string,
  distributionCenterId: number,
  dayId: Day
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.distributionCenters.deleteOperatingHours",
      method: "DELETE",
      url: `/v1/DistributionCenters(${distributionCenterId})/OperatingHours('${dayId}')`,
    },
    "CHA_0042",
    "Failed to delete Channel Advisor distribution center operating hours"
  );
};
