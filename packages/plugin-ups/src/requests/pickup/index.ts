import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsPickupCreationRequest,
  UpsPickupCreationResponse,
  UpsPickupCancelResponse,
  UpsPickupRateRequest,
  UpsPickupRateResponse,
  UpsPickupType,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const PICKUP_VERSION = "v2409";

/** Schedule a UPS on-call pickup. Returns the PRN (Pickup Request Number). */
export const createPickup = async (
  clientName: string,
  data: UpsPickupCreationRequest
): Promise<UpsPickupCreationResponse> => {
  const res = await tryHandleRequest<UpsPickupCreationResponse>(
    {
      clientName,
      requestName: "ups.pickup.create",
      method: "POST",
      url: `/api/pickupcreation/${PICKUP_VERSION}/pickup`,
      data,
    },
    "UPS_0010",
    "Failed to create UPS pickup"
  );
  return res.data;
};

/**
 * Cancel a UPS on-call pickup by PRN.
 *
 * The trailing `02` is Cancel's `CancelBy` — `01` cancels by account number
 * instead. It is a different enum from the one on the Rate path below; see
 * docs/ups-api.md#pickup-path-segments.
 */
export const cancelPickup = async (
  clientName: string,
  prn: string
): Promise<UpsPickupCancelResponse> => {
  const res = await tryHandleRequest<UpsPickupCancelResponse>(
    {
      clientName,
      requestName: "ups.pickup.cancel",
      method: "DELETE",
      url: `/api/shipments/${PICKUP_VERSION}/pickup/02`,
      headers: { Prn: prn },
    },
    "UPS_0011",
    "Failed to cancel UPS pickup"
  );
  return res.data;
};

/**
 * Get a pickup rate estimate without scheduling.
 *
 * The trailing segment is `pickuptype` and takes a name, not a code. It used to
 * send `01` — a value from Cancel's `CancelBy` enum — so this endpoint had never
 * worked, which is why the fix looks arbitrary:
 * docs/ups-api.md#pickup-path-segments.
 */
export const getPickupRate = async (
  clientName: string,
  data: UpsPickupRateRequest,
  pickupType: UpsPickupType = "oncall"
): Promise<UpsPickupRateResponse> => {
  const res = await tryHandleRequest<UpsPickupRateResponse>(
    {
      clientName,
      requestName: "ups.pickup.getRate",
      method: "POST",
      url: `/api/shipments/${PICKUP_VERSION}/pickup/${pickupType}`,
      data,
    },
    "UPS_0012",
    "Failed to get UPS pickup rate"
  );
  return res.data;
};

export type {
  UpsPickupCreationRequest,
  UpsPickupCreationResponse,
  UpsPickupCancelResponse,
  UpsPickupRateRequest,
  UpsPickupRateResponse,
  UpsPickupType,
} from "./types.js";
