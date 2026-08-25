import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import { randomUUID } from "node:crypto";
import type {
  UspsCreateLabelRequest,
  UspsLabelResponse,
  UspsCancelResponse,
  UspsLabelReprintRequest,
} from "./types.js";

/**
 * @param idempotencyKey Pass a stable value derived from your own order or
 * shipment id so a retry after a timeout returns the original label instead of
 * buying a second one. The default is a fresh UUID, which makes every call a
 * distinct purchase.
 */
export const createLabel = async (
  clientName: string,
  data: UspsCreateLabelRequest,
  accountNumber: string,
  idempotencyKey: string = randomUUID()
): Promise<UspsLabelResponse> => {
  const res = await tryHandleRequest<UspsLabelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.create",
      method: "POST",
      url: "/labels/v3/label",
      data,
      headers: {
        "X-Idempotency-Key": idempotencyKey,
        Accept: "application/vnd.usps.labels+json",
      },
      metadata: { uspsAccountNumber: accountNumber },
    },
    "USP_0001",
    "Failed to create USPS label"
  );
  return res.data;
};

export const voidLabel = async (
  clientName: string,
  trackingNumber: string,
  accountNumber: string
): Promise<UspsCancelResponse> => {
  const res = await tryHandleRequest<UspsCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.void",
      method: "DELETE",
      url: `/labels/v3/label/${trackingNumber}`,
      metadata: { uspsAccountNumber: accountNumber },
    },
    "USP_0003",
    "Failed to void USPS label"
  );
  return res.data;
};

export const reprintLabel = async (
  clientName: string,
  trackingNumber: string,
  accountNumber: string,
  data?: UspsLabelReprintRequest
): Promise<UspsLabelResponse> => {
  const res = await tryHandleRequest<UspsLabelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.reprint",
      method: "POST",
      url: `/labels/v3/label-reprint/${trackingNumber}`,
      data: data ?? {},
      headers: {
        Accept: "application/vnd.usps.labels+json",
      },
      metadata: { uspsAccountNumber: accountNumber },
    },
    "USP_0008",
    "Failed to reprint USPS label"
  );
  return res.data;
};
