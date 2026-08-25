import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { QueryData } from "../types.js";
import {
  AmazonConfirmShipmentPayload,
  AmazonGetOrderAddressResponse,
  AmazonGetOrderBuyerInfoResponse,
  GetAmazonOrderDetailsResponse,
  GetAmazonOrderItemsResponse,
  GetAmazonOrdersResponse,
} from "./types.js";

export const getOrders = async (
  clientName: string,
  awsRegion: AwsRegion,
  queryData: QueryData,
  pii = false
): Promise<GetAmazonOrdersResponse> => {
  const res = await handleSpapiRequest<GetAmazonOrdersResponse>(
    clientName,
    awsRegion,
    "AMZ_0011",
    "Failed to get Amazon orders",
    {
      endpoint: "ordersGetOrders",
      url: `/orders/v0/orders`,
      params: queryData,
      dataElements: pii ? ["shippingAddress", "buyerInfo"] : undefined,
    },
    "amazonSpapi.orders.getOrders"
  );
  return res.data;
};

export const getOrderDetails = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string,
  pii: boolean = false
): Promise<GetAmazonOrderDetailsResponse> => {
  const res = await handleSpapiRequest<GetAmazonOrderDetailsResponse>(
    clientName,
    awsRegion,
    "AMZ_0012",
    "Failed to get Amazon order details",
    {
      endpoint: "ordersGetOrder",
      url: `/orders/v0/orders/${orderId}`,
      dataElements: pii ? ["shippingAddress", "buyerInfo"] : undefined,
    },
    "amazonSpapi.orders.getOrder"
  );
  return res.data;
};

export const getOrderItems = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string,
  pii?: boolean,
  nextToken?: string
): Promise<GetAmazonOrderItemsResponse> => {
  const res = await handleSpapiRequest<GetAmazonOrderItemsResponse>(
    clientName,
    awsRegion,
    "AMZ_0013",
    "Failed to get Amazon order items",
    {
      endpoint: "ordersGetOrderItems",
      url: `/orders/v0/orders/${orderId}/orderItems`,
      dataElements: pii ? ["buyerInfo"] : undefined,
      params: nextToken ? { NextToken: nextToken } : undefined,
    },
    "amazonSpapi.orders.getOrderItems"
  );
  return res.data;
};

export const confirmOrderShipment = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string,
  payload: AmazonConfirmShipmentPayload
) => {
  const res = await handleSpapiRequest(
    clientName,
    awsRegion,
    "AMZ_0035",
    "Failed to confirm Amazon order shipment",
    {
      endpoint: "ordersConfirmShipment",
      url: `/orders/v0/orders/${orderId}/shipmentConfirmation`,
      data: payload,
    },
    "amazonSpapi.orders.confirmShipment"
  );
  return res.data;
};

export const getOrderAddress = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string
): Promise<AmazonGetOrderAddressResponse> => {
  const res = await handleSpapiRequest<AmazonGetOrderAddressResponse>(
    clientName,
    awsRegion,
    "AMZ_0068",
    "Failed to get Amazon order address",
    {
      endpoint: "ordersGetOrderAddress",
      url: `/orders/v0/orders/${orderId}/address`,
    },
    "amazonSpapi.orders.getOrderAddress"
  );
  return res.data;
};

export const getOrderBuyerInfo = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string
): Promise<AmazonGetOrderBuyerInfoResponse> => {
  const res = await handleSpapiRequest<AmazonGetOrderBuyerInfoResponse>(
    clientName,
    awsRegion,
    "AMZ_0069",
    "Failed to get Amazon order buyer info",
    {
      endpoint: "ordersGetOrderBuyerInfo",
      url: `/orders/v0/orders/${orderId}/buyerInfo`,
    },
    "amazonSpapi.orders.getOrderBuyerInfo"
  );
  return res.data;
};
