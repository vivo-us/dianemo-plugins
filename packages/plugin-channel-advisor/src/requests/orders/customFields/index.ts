import handleQueryOptions from "../../handleQueryOptions.js";
import { CAResult, CAResultList } from "../../types.js";
import handleCaRequest from "../../handleCaRequest.js";
import {
  CustomField,
  GetOrderCustomFieldOptions,
  GetOrderCustomFieldsOptions,
} from "./types.js";

export const getOrderCustomFields = async (
  clientName: string,
  orderId: number,
  options?: GetOrderCustomFieldsOptions
): Promise<CAResultList<CustomField>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<CustomField>>(
    {
      clientName,
      requestName: "channelAdvisor.orderCustomFields.list",
      method: "GET",
      url: `/v1/Orders(${orderId})/CustomFields${query}`,
    },
    "CHA_0043",
    "Failed to fetch Channel Advisor order custom fields"
  );
  return res.data;
};

export const getOrderCustomField = async (
  clientName: string,
  orderId: number,
  fieldId: number,
  options?: GetOrderCustomFieldOptions
): Promise<CAResult<CustomField>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResult<CustomField>>(
    {
      clientName,
      requestName: "channelAdvisor.orderCustomFields.get",
      method: "GET",
      url: `/v1/Orders(${orderId})/CustomFields(${fieldId})${query}`,
    },
    "CHA_0044",
    "Failed to fetch Channel Advisor order custom field"
  );
  return res.data;
};

export const updateOrderCustomFieldValue = async (
  clientName: string,
  orderId: number,
  fieldId: number,
  value: string
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.orderCustomFields.update",
      method: "PATCH",
      url: `/v1/Orders(${orderId})/CustomFields(${fieldId})`,
      data: { Value: value },
    },
    "CHA_0045",
    "Failed to update Channel Advisor order custom field value"
  );
};
