import { MainfreightRegion, MainfreightServiceType } from "../types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { trackService } from "../tracking/index.js";
import { resolveRegion } from "../utils.js";
import {
  MainfreightOutboundOrderResponse,
  MainfreightOutboundOrderData,
} from "./types.js";

export const getOutboundOrder = async (
  clientName: string,
  serviceType: MainfreightServiceType,
  region: MainfreightRegion,
  reference: string
) => {
  return await trackService(
    clientName,
    serviceType,
    region,
    reference,
    "OutboundReference"
  );
};

export const createOutboundOrder = async (
  clientName: string,
  region: MainfreightRegion,
  data: MainfreightOutboundOrderData
): Promise<MainfreightOutboundOrderResponse> => {
  const resolvedRegion = resolveRegion(region);
  const res = await tryHandleRequest<MainfreightOutboundOrderResponse>(
    {
      clientName,
      requestName: "mainfreight.outboundOrders.create",
      method: "POST",
      url: `/Warehousing/1.1/Customers/Order?region=${resolvedRegion}`,
      data,
    },
    "MFT_0002",
    "Failed to create Mainfreight outbound order"
  );
  return res.data;
};

export const updateOutboundOrder = async (
  clientName: string,
  region: MainfreightRegion,
  orderId: string,
  data: MainfreightOutboundOrderResponse
) => {
  const resolvedRegion = resolveRegion(region);
  await tryHandleRequest(
    {
      clientName,
      requestName: "mainfreight.outboundOrders.update",
      method: "PUT",
      url: `/Warehousing/1.1/Customers/Order/${orderId}?region=${resolvedRegion}`,
      data,
    },
    "MFT_0003",
    "Failed to update Mainfreight outbound order"
  );
};

// Reported to 500 rather than refuse, on accounts where the caller cannot
// delete — unverified, and the one call that would settle it:
// docs/mainfreight-api.md#delete-has-been-reported-to-500
export const deleteOutboundOrder = async (
  clientName: string,
  region: MainfreightRegion,
  orderId: string
) => {
  const resolvedRegion = resolveRegion(region);
  await tryHandleRequest(
    {
      clientName,
      requestName: "mainfreight.outboundOrders.delete",
      method: "DELETE",
      url: `/Warehousing/1.1/Customers/Order/${orderId}?region=${resolvedRegion}`,
    },
    "MFT_0004",
    "Failed to delete Mainfreight outbound order"
  );
};
