import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import {
  UnisSearchCreatedData,
  UnisSearchUpdatedData,
  UnisSearchUpdatedDataResponse,
} from "../types.js";
import {
  CancelUnisOrderData,
  CancelUnisOrderResponse,
  CreateUnisOrderData,
  CreateUnisOrderResponse,
  UploadLabelForUnisOrderData,
  UnisOrderItemData,
  SearchUnisOrdersDataResponse,
} from "./types.js";

export const getOrdersHeadLevel = async (
  clientName: string,
  data: UnisSearchUpdatedData
): Promise<UnisSearchUpdatedDataResponse<object>> => {
  const res = await tryHandleRequest<UnisSearchUpdatedDataResponse<object>>(
    {
      clientName,
      requestName: "unis.outboundOrders.listHead",
      method: "POST",
      url: "/edi/outbound/order-level/search-by-paging",
      data,
    },
    "UNS_0004",
    "Failed to fetch UNIS outbound orders at head level"
  );
  return res.data;
};

export const getOrdersItemLevel = async (
  clientName: string,
  data: UnisSearchUpdatedData
): Promise<UnisSearchUpdatedDataResponse<UnisOrderItemData>> => {
  const res = await tryHandleRequest<
    UnisSearchUpdatedDataResponse<UnisOrderItemData>
  >(
    {
      clientName,
      requestName: "unis.outboundOrders.listItems",
      method: "POST",
      url: "/edi/outbound/order-item-level/search-by-paging",
      data,
    },
    "UNS_0005",
    "Failed to fetch UNIS outbound orders at item level"
  );
  return res.data;
};

export const createOrder = async (
  clientName: string,
  data: CreateUnisOrderData
): Promise<CreateUnisOrderResponse> => {
  const res = await tryHandleRequest<CreateUnisOrderResponse>(
    {
      clientName,
      requestName: "unis.outboundOrders.create",
      method: "POST",
      url: "/edi/outbound/order",
      data,
    },
    "UNS_0001",
    "Failed to create UNIS outbound order"
  );
  const order = res.data.Orders[0];
  if (!order || order.Status === "Fail") {
    throw new RequestError("UNS_0006", "UNIS outbound order creation failed", {
      metadata: {
        context: order?.Error ?? "UNIS returned no order in the response",
      },
    });
  }
  return res.data;
};

export const cancelOrder = async (
  clientName: string,
  data: CancelUnisOrderData
): Promise<CancelUnisOrderResponse> => {
  const res = await tryHandleRequest<CancelUnisOrderResponse>(
    {
      clientName,
      requestName: "unis.outboundOrders.cancel",
      method: "PUT",
      url: "/edi/outbound/order/cancel",
      data,
    },
    "UNS_0002",
    "Failed to cancel UNIS outbound order"
  );
  return res.data;
};

export const uploadLabel = async (
  clientName: string,
  data: UploadLabelForUnisOrderData
) => {
  await tryHandleRequest(
    {
      clientName,
      requestName: "unis.outboundOrders.uploadLabel",
      method: "POST",
      url: "/edi/outbound/order/file-upload",
      data,
    },
    "UNS_0003",
    "Failed to upload shipping label for UNIS outbound order"
  );
};

export const searchOrders = async (
  clientName: string,
  data: UnisSearchCreatedData
): Promise<SearchUnisOrdersDataResponse> => {
  const res = await tryHandleRequest<SearchUnisOrdersDataResponse>(
    {
      clientName,
      requestName: "unis.outboundOrders.search",
      method: "POST",
      url: "/edi/outbound/order/dc/search-by-paging",
      data,
    },
    "UNS_0010",
    "Failed to search UNIS outbound orders"
  );
  return res.data;
};
