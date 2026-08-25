import handleQueryOptions from "../handleQueryOptions.js";
import { CAResult, CAResultList } from "../types.js";
import handleCaRequest from "../handleCaRequest.js";
import {
  GetProfileDetailsOptions,
  GetProfilesDetailsOptions,
  Profile,
} from "./types.js";

export const getProfilesDetails = async (
  clientName: string,
  options?: { queryOptions?: GetProfilesDetailsOptions }
): Promise<CAResultList<CAResult<Profile>>> => {
  const query = handleQueryOptions(options?.queryOptions);
  const res = await handleCaRequest<CAResultList<CAResult<Profile>>>(
    {
      clientName,
      requestName: "channelAdvisor.profiles.list",
      method: "GET",
      url: `/v1/Profiles${query}`,
    },
    "CHA_0005",
    "Failed to fetch Channel Advisor profiles details"
  );
  return res.data;
};

export const getProfileDetails = async (
  clientName: string,
  profileId: string,
  options?: { queryOptions?: GetProfileDetailsOptions }
): Promise<CAResult<Profile>> => {
  const query = handleQueryOptions(options?.queryOptions);
  const res = await handleCaRequest<CAResult<Profile>>(
    {
      clientName,
      requestName: "channelAdvisor.profiles.get",
      method: "GET",
      url: `/v1/Profiles(${profileId})${query}`,
    },
    "CHA_0006",
    "Failed to fetch Channel Advisor profile details"
  );
  return res.data;
};
