import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  AcknowledgeWalmartOrderResponse,
  GetWalmartOrderData,
  GetWalmartOrderResponse,
  GetWalmartOrdersData,
  GetWalmartOrdersResponse,
  GetWalmartReleasedOrdersData,
  WalmartCancelOrderData,
  WalmartRefundOrderData,
  WalmartShipOrderData,
} from "./types.js";

export const getOrders = async (
  clientName: string,
  filters?: GetWalmartOrdersData
) => {
  const res = await tryHandleRequest<GetWalmartOrdersResponse>(
    {
      clientName,
      requestName: "walmart.orders.list",
      url: `/v3/orders`,
      method: "GET",
      params: filters,
    },
    "WMT_0001",
    "Failed to fetch Walmart orders"
  );
  return res.data;
};

export const getReleasedOrders = async (
  clientName: string,
  filters?: GetWalmartReleasedOrdersData
) => {
  const res = await tryHandleRequest<GetWalmartOrdersResponse>(
    {
      clientName,
      requestName: "walmart.orders.listReleased",
      url: `/v3/orders/released`,
      method: "GET",
      params: filters,
    },
    "WMT_0019",
    "Failed to fetch Walmart released orders"
  );
  return res.data;
};

export const getOrder = async (
  clientName: string,
  purchaseOrderId: string,
  filters?: GetWalmartOrderData
) => {
  const res = await tryHandleRequest<GetWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.get",
      url: `/v3/orders/${purchaseOrderId}`,
      method: "GET",
      params: filters,
    },
    "WMT_0002",
    "Failed to fetch Walmart order"
  );
  return res.data;
};

export const acknowledgeOrder = async (
  clientName: string,
  purchaseOrderId: string
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.acknowledge",
      url: `/v3/orders/${purchaseOrderId}/acknowledge`,
      method: "POST",
    },
    "WMT_0005",
    "Failed to acknowledge Walmart order"
  );
  return res.data;
};

export const shipOrderLines = async (
  clientName: string,
  purchaseOrderId: string,
  data: WalmartShipOrderData
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.ship",
      url: `/v3/orders/${purchaseOrderId}/shipping`,
      method: "POST",
      data,
    },
    "WMT_0006",
    "Failed to ship Walmart order lines"
  );
  return res.data;
};

export const cancelOrderLines = async (
  clientName: string,
  purchaseOrderId: string,
  data: WalmartCancelOrderData
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.cancel",
      url: `/v3/orders/${purchaseOrderId}/cancel`,
      method: "POST",
      data,
    },
    "WMT_0007",
    "Failed to cancel Walmart order lines"
  );
  return res.data;
};

export const refundOrderLines = async (
  clientName: string,
  purchaseOrderId: string,
  data: WalmartRefundOrderData
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.refund",
      url: `/v3/orders/${purchaseOrderId}/refund`,
      method: "POST",
      data,
    },
    "WMT_0008",
    "Failed to refund Walmart order lines"
  );
  return res.data;
};
