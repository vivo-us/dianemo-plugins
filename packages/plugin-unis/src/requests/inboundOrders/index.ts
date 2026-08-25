import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import {
  GetUnisOrdersData,
  GetUnisOrdersDataResponse,
} from "../outboundOrders/types.js";
import {
  CancelUnisInboundOrderData,
  CreateUnisInboundOrderResponse,
  InboundOrderHeadLevel,
  UnisCreateInboundOrderData,
} from "./types.js";

export const getInboundOrdersHeadLevel = async (
  clientName: string,
  data: GetUnisOrdersData
): Promise<GetUnisOrdersDataResponse<InboundOrderHeadLevel>> => {
  const res = await tryHandleRequest<
    GetUnisOrdersDataResponse<InboundOrderHeadLevel>
  >(
    {
      clientName,
      requestName: "unis.inboundOrders.listHead",
      method: "POST",
      url: "/edi/inbound/receipt-level/search-by-paging",
      data,
    },
    "UNS_0007",
    "Failed to fetch UNIS inbound orders at head level"
  );
  return res.data;
};

export const createInboundOrder = async (
  clientName: string,
  data: UnisCreateInboundOrderData
): Promise<CreateUnisInboundOrderResponse> => {
  const res = await tryHandleRequest<CreateUnisInboundOrderResponse>(
    {
      clientName,
      requestName: "unis.inboundOrders.create",
      method: "POST",
      url: "/edi/inbound/receipt",
      data,
    },
    "UNS_0008",
    "Failed to create UNIS inbound order"
  );
  const receipt = res.data.Receipts[0];
  if (!receipt || receipt.Error) {
    throw new RequestError(
      "UNS_0011",
      "UNIS inbound order creation returned an error",
      {
        metadata: {
          context: receipt?.Error ?? "UNIS returned no receipt in the response",
        },
      }
    );
  }
  return res.data;
};

export const cancelInboundOrder = async (
  clientName: string,
  data: CancelUnisInboundOrderData
) => {
  const res = await tryHandleRequest<{ error?: string }>(
    {
      clientName,
      requestName: "unis.inboundOrders.cancel",
      method: "PUT",
      url: "/edi/inbound/receipt/cancel",
      data,
    },
    "UNS_0015",
    "Failed to cancel UNIS inbound order"
  );
  if (res.data.error) {
    throw new RequestError(
      "UNS_0009",
      "UNIS inbound order cancellation returned an error",
      { metadata: { context: res.data.error } }
    );
  }
  return res.data;
};
