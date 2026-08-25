import { FedexShippingRequest, FedexShippingResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const makeFedexPurchaseRequest = async (
  clientName: string,
  data: FedexShippingRequest
): Promise<FedexShippingResponse> => {
  const url = "/ship/v1/shipments";
  const res = await tryHandleRequest<FedexShippingResponse>(
    {
      clientName,
      requestName: "fedex.shipping.createShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0001",
    "Failed to purchase FedEx shipment"
  );

  return res.data;
};
