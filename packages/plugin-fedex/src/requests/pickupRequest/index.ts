import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  CancelPickupData,
  CancelPickupResponse,
  CheckPickupAvailabilityData,
  CreatePickupData,
  CreatePickupResponse,
  CheckPickupAvailabilityResponse,
} from "./types.js";

export const checkPickupAvailability = async (
  clientName: string,
  data: CheckPickupAvailabilityData
): Promise<CheckPickupAvailabilityResponse> => {
  const url = "/pickup/v1/pickups/availabilities";
  const res = await tryHandleRequest<CheckPickupAvailabilityResponse>(
    {
      clientName,
      requestName: "fedex.pickup.checkAvailability",
      method: "POST",
      url,
      data,
    },
    "FDX_0007",
    "Failed to check FedEx pickup availability"
  );
  return res.data;
};

export const createPickup = async (
  clientName: string,
  data: CreatePickupData
): Promise<CreatePickupResponse> => {
  const url = "/pickup/v1/pickups";
  const res = await tryHandleRequest<CreatePickupResponse>(
    {
      clientName,
      requestName: "fedex.pickup.create",
      method: "POST",
      url,
      data,
    },
    "FDX_0008",
    "Failed to create FedEx pickup"
  );
  return res.data;
};

export const cancelPickup = async (
  clientName: string,
  data: CancelPickupData
): Promise<CancelPickupResponse> => {
  const url = "/pickup/v1/pickups/cancel";
  const res = await tryHandleRequest<CancelPickupResponse>(
    {
      clientName,
      requestName: "fedex.pickup.cancel",
      method: "PUT",
      url,
      data,
    },
    "FDX_0009",
    "Failed to cancel FedEx pickup"
  );
  return res.data;
};
