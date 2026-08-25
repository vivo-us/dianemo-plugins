import handleQueryOptions from "../handleQueryOptions.js";
import { CAResult, CAResultList } from "../types.js";
import handleCaRequest from "../handleCaRequest.js";
import {
  CreateOrder,
  GetOrder,
  GetOrderItem,
  GetOrderItemsOptions,
  GetOrderOptions,
  GetOrdersOptions,
  UpdateOrder,
  UpdateOrderItem,
} from "./types.js";

/**
 * The queue an order-import job reads. `exported` is set here and overrides
 * whatever the caller passed: with the flag omitted this and
 * `getAllExportedOrders` emit byte-identical requests, and an import job re-reads
 * the account's whole order history every run.
 */

export const getAllUnexportedOrders = async (
  clientName: string,
  options?: GetOrdersOptions
): Promise<CAResultList<GetOrder>> => {
  const query = handleQueryOptions({ ...options, exported: false });
  const res = await handleCaRequest<CAResultList<GetOrder>>(
    {
      clientName,
      requestName: "channelAdvisor.orders.listUnexported",
      method: "GET",
      url: `/v1/Orders${query}`,
    },
    "CHA_0069",
    "Failed to fetch Channel Advisor unexported orders"
  );
  return res.data;
};

/** As above, `exported` is set here and overrides whatever the caller passed. */

export const getAllExportedOrders = async (
  clientName: string,
  options?: GetOrdersOptions
): Promise<CAResultList<GetOrder>> => {
  const query = handleQueryOptions({ ...options, exported: true });
  const res = await handleCaRequest<CAResultList<GetOrder>>(
    {
      clientName,
      requestName: "channelAdvisor.orders.listExported",
      method: "GET",
      url: `/v1/Orders${query}`,
    },
    "CHA_0070",
    "Failed to fetch Channel Advisor exported orders"
  );
  return res.data;
};

/** Every order, unless the caller narrows it — including via `exported`. */

export const getOrders = async (
  clientName: string,
  options?: GetOrdersOptions
): Promise<CAResultList<GetOrder>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<GetOrder>>(
    {
      clientName,
      requestName: "channelAdvisor.orders.list",
      method: "GET",
      url: `/v1/Orders${query}`,
    },
    "CHA_0071",
    "Failed to fetch Channel Advisor orders"
  );
  return res.data;
};

export const getOrder = async (
  clientName: string,
  orderId: number,
  options?: GetOrderOptions
): Promise<CAResult<GetOrder>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<GetOrder>>(
    {
      clientName,
      requestName: "channelAdvisor.orders.get",
      method: "GET",
      url: `/v1/Orders(${orderId})${query}`,
    },
    "CHA_0072",
    "Failed to fetch Channel Advisor order"
  );
  return res.data;
};

export const getOrderItems = async (
  clientName: string,
  options?: GetOrderItemsOptions
): Promise<CAResultList<GetOrderItem>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<GetOrderItem>>(
    {
      clientName,
      requestName: "channelAdvisor.orders.listItems",
      method: "GET",
      url: `/v1/OrderItems${query}`,
    },
    "CHA_0081",
    "Failed to fetch Channel Advisor order items"
  );
  return res.data;
};

export const createOrder = async (
  clientName: string,
  data: CreateOrder
): Promise<CAResult<GetOrder>> => {
  const res = await handleCaRequest<CAResult<GetOrder>>(
    {
      clientName,
      requestName: "channelAdvisor.orders.create",
      method: "POST",
      url: "/v1/Orders/Create",
      data,
    },
    "CHA_0073",
    "Failed to create Channel Advisor order"
  );
  return res.data;
};

export const updateOrder = async (
  clientName: string,
  orderId: number,
  data: UpdateOrder
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.update",
      method: "PATCH",
      url: `/v1/Orders(${orderId})`,
      data,
    },
    "CHA_0074",
    "Failed to update Channel Advisor order"
  );
};

export const updateOrderItem = async (
  clientName: string,
  orderItemId: number,
  data: UpdateOrderItem
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.updateItem",
      method: "PATCH",
      url: `/v1/OrderItems(${orderItemId})`,
      data,
    },
    "CHA_0075",
    "Failed to update Channel Advisor order item"
  );
};

export const markOrderAsExported = async (
  clientName: string,
  orderId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.markExported",
      method: "POST",
      url: `/v1/Orders(${orderId})/Export`,
      headers: { "Content-Type": "application/json" },
    },
    "CHA_0076",
    "Failed to mark Channel Advisor order as exported"
  );
};

export const markOrderAsUnexported = async (
  clientName: string,
  orderId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.markUnexported",
      method: "DELETE",
      url: `/v1/Orders(${orderId})/Export`,
    },
    "CHA_0077",
    "Failed to mark Channel Advisor order as unexported"
  );
};

export const markOrderAsConfirmed = async (
  clientName: string,
  orderId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.confirm",
      method: "POST",
      url: `/v1/Orders(${orderId})/Confirm`,
    },
    "CHA_0078",
    "Failed to confirm Channel Advisor order"
  );
};

export const markOrderAsUnconfirmed = async (
  clientName: string,
  orderId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.deny",
      method: "POST",
      url: `/v1/Orders(${orderId})/Deny`,
    },
    "CHA_0079",
    "Failed to deny Channel Advisor order confirmation"
  );
};

export const cancelOrder = async (clientName: string, orderId: number) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orders.cancel",
      method: "POST",
      url: `/v1/Orders(${orderId})/Adjust`,
    },
    "CHA_0080",
    "Failed to cancel Channel Advisor order"
  );
};
