import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExCancelShipmentRequest,
  FedExCancelShipmentResponse,
} from "./types.js";

export const cancelShipment = async (
  clientName: string,
  data: FedExCancelShipmentRequest
): Promise<FedExCancelShipmentResponse> => {
  const url = "/ship/v1/shipments/cancel";
  const res = await tryHandleRequest<FedExCancelShipmentResponse>(
    {
      clientName,
      requestName: "fedex.shipping.cancelShipment",
      method: "PUT",
      url,
      data,
    },
    "FDX_0003",
    "Failed to cancel FedEx shipment"
  );
  return res.data;
};
