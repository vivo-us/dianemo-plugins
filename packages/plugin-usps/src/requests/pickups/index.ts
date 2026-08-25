import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsPickupEligibilityParams,
  UspsPickupEligibilityResponse,
  UspsSchedulePickupRequest,
  UspsPickupConfirmation,
  UspsPickupDetails,
} from "./types.js";

export const checkEligibility = async (
  clientName: string,
  params: UspsPickupEligibilityParams
): Promise<UspsPickupEligibilityResponse> => {
  const res = await tryHandleRequest<UspsPickupEligibilityResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.eligibility",
      method: "GET",
      url: "/pickup/v3/carrier-pickup/eligibility",
      params,
    },
    "USP_0010",
    "Failed to check USPS pickup eligibility"
  );
  return res.data;
};

export const schedulePickup = async (
  clientName: string,
  data: UspsSchedulePickupRequest
): Promise<UspsPickupConfirmation> => {
  const res = await tryHandleRequest<UspsPickupConfirmation>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.schedule",
      method: "POST",
      url: "/pickup/v3/carrier-pickup",
      data,
    },
    "USP_0006",
    "Failed to schedule USPS pickup"
  );
  return res.data;
};

export const getPickup = async (
  clientName: string,
  confirmationNumber: string
): Promise<{ pickup: UspsPickupDetails; etag: string }> => {
  const res = await tryHandleRequest<UspsPickupDetails>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.get",
      method: "GET",
      url: `/pickup/v3/carrier-pickup/${confirmationNumber}`,
    },
    "USP_0011",
    "Failed to get USPS pickup details"
  );
  return {
    pickup: res.data,
    etag: (res.headers?.["etag"] as string) ?? "",
  };
};

export const cancelPickup = async (
  clientName: string,
  confirmationNumber: string,
  etag: string
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.cancel",
      method: "DELETE",
      url: `/pickup/v3/carrier-pickup/${confirmationNumber}`,
      headers: {
        "If-Match": etag,
      },
    },
    "USP_0007",
    "Failed to cancel USPS pickup"
  );
};
