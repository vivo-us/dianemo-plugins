import handleCaRequest from "../../handleCaRequest.js";
import { ShipOrderRequest } from "./types.js";

export const markOrderPendingShipment = async (
  clientName: string,
  orderId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.shipments.markPending",
      method: "PATCH",
      url: `/v1/Orders(${orderId})`,
      data: { ShippingStatus: "PendingShipment" },
    },
    "CHA_0059",
    "Failed to mark Channel Advisor order as pending shipment"
  );
};

export const shipOrder = async (
  clientName: string,
  orderId: number,
  data: ShipOrderRequest
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.shipments.ship",
      method: "POST",
      url: `/v1/Orders(${orderId})/Ship`,
      data: { Value: data },
    },
    "CHA_0060",
    "Failed to ship Channel Advisor order"
  );
};
