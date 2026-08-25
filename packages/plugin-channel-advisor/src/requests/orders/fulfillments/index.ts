import handleQueryOptions from "../../handleQueryOptions.js";
import { CAResult, CAResultList } from "../../types.js";
import handleCaRequest from "../../handleCaRequest.js";
import {
  CreateFulfillment,
  GetFulfillment,
  GetFulfillmentOptions,
  GetFulfillmentsOptions,
  UpdateFulfillment,
} from "./types.js";

export const getFulfillments = async (
  clientName: string,
  options?: GetFulfillmentsOptions
): Promise<CAResultList<GetFulfillment>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<GetFulfillment>>(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.list",
      method: "GET",
      url: `/v1/Fulfillments${query}`,
    },
    "CHA_0046",
    "Failed to fetch Channel Advisor fulfillments"
  );
  return res.data;
};

export const getFulfillment = async (
  clientName: string,
  fulfillmentId: number,
  options?: GetFulfillmentOptions
): Promise<CAResult<GetFulfillment>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<GetFulfillment>>(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.get",
      method: "GET",
      url: `/v1/Fulfillments(${fulfillmentId})${query}`,
    },
    "CHA_0047",
    "Failed to fetch Channel Advisor fulfillment"
  );
  return res.data;
};

export const createFulfillment = async (
  clientName: string,
  data: CreateFulfillment
): Promise<CAResult<GetFulfillment>> => {
  const res = await handleCaRequest<CAResult<GetFulfillment>>(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.create",
      method: "POST",
      url: "/v1/Fulfillments",
      data,
    },
    "CHA_0048",
    "Failed to create Channel Advisor fulfillment"
  );
  return res.data;
};

export const moveFulfillmentToOtherFulfillment = async (
  clientName: string,
  sourceFulfillmentId: number,
  destinationFulfillmentId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.move",
      method: "POST",
      url: `/v1/Fulfillments(${sourceFulfillmentId})/Move`,
      data: { DestinationFulfillmentID: destinationFulfillmentId },
    },
    "CHA_0049",
    "Failed to move Channel Advisor fulfillment to another fulfillment"
  );
};

/** With no `quantity`, ChannelAdvisor moves the entire fulfillment item. */

export const moveFulfillmentItemToOtherFulfillment = async (
  clientName: string,
  sourceFulfillmentItemId: number,
  destinationFulfillmentId: number,
  quantity?: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.moveItem",
      method: "POST",
      url: `/v1/FulfillmentItems(${sourceFulfillmentItemId})/Move`,
      data: {
        DestinationFulfillmentID: destinationFulfillmentId,
        ...(quantity ? { Quantity: quantity } : {}),
      },
    },
    "CHA_0050",
    "Failed to move Channel Advisor fulfillment item to another fulfillment"
  );
};

export const markFulfillmentAsConfirmed = async (
  clientName: string,
  fulfillmentId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.confirm",
      method: "POST",
      url: `/v1/Fulfillments(${fulfillmentId})/Confirm`,
    },
    "CHA_0051",
    "Failed to confirm Channel Advisor fulfillment"
  );
};

export const markFulfillmentAsUnconfirmed = async (
  clientName: string,
  fulfillmentId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.deny",
      method: "POST",
      url: `/v1/Fulfillments(${fulfillmentId})/Deny`,
    },
    "CHA_0052",
    "Failed to deny Channel Advisor fulfillment confirmation"
  );
};

export const updateFulfillment = async (
  clientName: string,
  fulfillmentId: number,
  data: UpdateFulfillment
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.update",
      method: "PATCH",
      url: `/v1/Fulfillments(${fulfillmentId})`,
      data,
    },
    "CHA_0053",
    "Failed to update Channel Advisor fulfillment"
  );
};

export const deleteFulfillment = async (
  clientName: string,
  fulfillmentId: number
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.fulfillments.delete",
      method: "DELETE",
      url: `/v1/Fulfillments(${fulfillmentId})`,
    },
    "CHA_0054",
    "Failed to delete Channel Advisor fulfillment"
  );
};
