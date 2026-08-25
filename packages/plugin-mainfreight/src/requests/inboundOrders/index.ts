import { MainfreightRegion, MainfreightServiceType } from "../types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { trackService } from "../tracking/index.js";
import { resolveRegion } from "../utils.js";
import {
  MainfreightInboundOrderResponse,
  MainfreightInboundOrderData,
} from "./types.js";

export const getInboundOrder = async (
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
    "InboundReference"
  );
};

export const createInboundOrder = async (
  clientName: string,
  region: MainfreightRegion,
  data: MainfreightInboundOrderData
): Promise<MainfreightInboundOrderResponse> => {
  const resolvedRegion = resolveRegion(region);
  const res = await tryHandleRequest<MainfreightInboundOrderResponse>(
    {
      clientName,
      requestName: "mainfreight.inboundOrders.create",
      method: "POST",
      url: `/Warehousing/1.1/Customers/Inward?region=${resolvedRegion}`,
      data,
    },
    "MFT_0005",
    "Failed to create Mainfreight inbound order"
  );
  return res.data;
};

export const updateInboundOrder = async (
  clientName: string,
  region: MainfreightRegion,
  orderId: string,
  data: MainfreightInboundOrderResponse
) => {
  const resolvedRegion = resolveRegion(region);
  await tryHandleRequest(
    {
      clientName,
      requestName: "mainfreight.inboundOrders.update",
      method: "PUT",
      url: `/Warehousing/1.1/Customers/Inward/${orderId}?region=${resolvedRegion}`,
      data,
    },
    "MFT_0006",
    "Failed to update Mainfreight inbound order"
  );
};

export const deleteInboundOrder = async (
  clientName: string,
  region: MainfreightRegion,
  orderId: string
) => {
  const resolvedRegion = resolveRegion(region);
  await tryHandleRequest(
    {
      clientName,
      requestName: "mainfreight.inboundOrders.delete",
      method: "DELETE",
      url: `/Warehousing/1.1/Customers/Inward/${orderId}?region=${resolvedRegion}`,
    },
    "MFT_0007",
    "Failed to delete Mainfreight inbound order"
  );
};
