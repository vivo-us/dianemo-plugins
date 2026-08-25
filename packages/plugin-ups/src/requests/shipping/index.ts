import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  VoidUpsShipmentResponse,
  UpsShipmentRequest,
  UpsShipmentResponse,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const SHIPPING_VERSION = "v2409";

/**
 * Void a shipment, or one package within it.
 *
 * The path takes the shipment's id, which for a single-package shipment is the
 * same 1Z value as the package's tracking number and on a multi-package shipment
 * is not — hence two separate arguments here, and a bug worth reading up on
 * before collapsing them again: docs/ups-api.md#void-takes-the-shipment-id-not-the-tracking-number
 *
 * @param trackingNumber - Voids only this package, leaving the rest of the
 * shipment intact. Omit it to void the whole shipment.
 */
export const voidShipment = async (
  clientName: string,
  shipmentIdentificationNumber: string,
  trackingNumber?: string
): Promise<VoidUpsShipmentResponse> => {
  const url = `/api/shipments/${SHIPPING_VERSION}/void/cancel/${shipmentIdentificationNumber}${
    trackingNumber ? `?trackingnumber=${trackingNumber}` : ""
  }`;
  const res = await tryHandleRequest<VoidUpsShipmentResponse>(
    {
      clientName,
      requestName: "ups.shipping.voidShipment",
      method: "DELETE",
      url,
    },
    "UPS_0003",
    "Failed to void UPS shipment"
  );
  return res.data;
};

/** Purchases a label. */
export const requestShipment = async (
  clientName: string,
  data: UpsShipmentRequest
): Promise<UpsShipmentResponse> => {
  const res = await tryHandleRequest<UpsShipmentResponse>(
    {
      clientName,
      requestName: "ups.shipping.createShipment",
      method: "POST",
      url: `/api/shipments/${SHIPPING_VERSION}/ship`,
      data,
    },
    "UPS_0005",
    "Failed to create UPS shipment"
  );
  return res.data;
};
