import handleQueryOptions from "../../handleQueryOptions.js";
import handleCaRequest from "../../handleCaRequest.js";
import {
  GetPickupLabelOptions,
  PickupLabel,
  PurchaseShippingLabelData,
  ShippingRate,
} from "./types.js";

export const getPickupLabel = async (
  clientName: string,
  fulfillmentId: number,
  options?: GetPickupLabelOptions
): Promise<PickupLabel> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<PickupLabel>(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.getPickupLabel",
      method: "GET",
      url: `/v1/Fulfillments(${fulfillmentId})/PickupLabel${query}`,
    },
    "CHA_0061",
    "Failed to fetch Channel Advisor pickup label"
  );
  return res.data;
};

export const getChannelPackingSlip = async (
  clientName: string,
  fulfillmentId: number
): Promise<string> => {
  const res = await handleCaRequest<string>(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.getChannelPackingSlip",
      method: "GET",
      url: `/v1/Fulfillments(${fulfillmentId})/ChannelPackingSlip`,
    },
    "CHA_0062",
    "Failed to fetch Channel Advisor channel packing slip"
  );
  return res.data;
};

export const getChannelReturnShippingLabel = async (
  clientName: string,
  fulfillmentId: number
): Promise<string> => {
  const res = await handleCaRequest<string>(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.getChannelReturnLabel",
      method: "GET",
      url: `/v1/Fulfillments(${fulfillmentId})/ChannelReturnLabel`,
    },
    "CHA_0063",
    "Failed to fetch Channel Advisor channel return shipping label"
  );
  return res.data;
};

export const getReturnLabel = async (
  clientName: string,
  fulfillmentId: number
): Promise<string> => {
  const res = await handleCaRequest<string>(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.getReturnLabel",
      method: "GET",
      url: `/v1/Fulfillments(${fulfillmentId})/ReturnLabel`,
    },
    "CHA_0064",
    "Failed to fetch Channel Advisor return label"
  );
  return res.data;
};

export const getShippingLabel = async (
  clientName: string,
  fulfillmentId: number
): Promise<string> => {
  const res = await handleCaRequest<string>(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.getShippingLabel",
      method: "GET",
      url: `/v1/Fulfillments(${fulfillmentId})/Label`,
    },
    "CHA_0065",
    "Failed to fetch Channel Advisor shipping label"
  );
  return res.data;
};

export const getShippingRates = async (
  clientName: string,
  orderId: number,
  data: ShippingRate
): Promise<string> => {
  const res = await handleCaRequest<string>(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.list",
      method: "POST",
      url: `/v1/Orders(${orderId})/ShippingRates`,
      data,
    },
    "CHA_0066",
    "Failed to fetch Channel Advisor shipping rates"
  );
  return res.data;
};

export const purchaseShippingLabel = async (
  clientName: string,
  orderId: number,
  data: PurchaseShippingLabelData
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.purchaseLabel",
      method: "POST",
      url: `/v1/Orders(${orderId})/PurchaseLabel`,
      data,
    },
    "CHA_0067",
    "Failed to purchase Channel Advisor shipping label"
  );
};

export const cancelShippingLabel = async (
  clientName: string,
  fulfillmentId: number,
  markUnshipped?: boolean
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.shippingRates.cancelLabel",
      method: "DELETE",
      url: `/v1/Fulfillments(${fulfillmentId})/Label${
        markUnshipped ? "?unshipfulfillment=true" : ""
      }`,
    },
    "CHA_0068",
    "Failed to cancel Channel Advisor shipping label"
  );
};
