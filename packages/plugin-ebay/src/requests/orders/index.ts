import { tryHandleRequest } from "@dianemo/plugin-kit";
import { EbayRequestOptions } from "../types.js";
import { RequestError } from "@dianemo/core";
import {
  EbayOrder,
  GetEbayOrderData,
  GetEbayOrdersData,
  GetEbayOrdersResponse,
} from "./types.js";

export const getOrders = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  data?: GetEbayOrdersData
): Promise<GetEbayOrdersResponse> => {
  const filters: string[] | undefined =
    data?.filters && Object.keys(data.filters).length ? [] : undefined;
  if (filters && data?.filters?.creationDate) {
    filters.push(
      `creationdate:[${data.filters.creationDate.min}..${
        data.filters.creationDate.max ?? ""
      }]`
    );
  }
  if (filters && data?.filters?.lastModifiedDate) {
    filters.push(
      `lastmodifieddate:[${data.filters.lastModifiedDate.min}..${
        data.filters.lastModifiedDate.max ?? ""
      }]`
    );
  }
  if (filters && data?.filters?.orderFulfillmentStatus) {
    filters.push(
      `orderfulfillmentstatus:{${data.filters.orderFulfillmentStatus.join(
        "|"
      )}}`
    );
  }
  // eBay ignores every other query parameter when `orderIds` is set, so a caller
  // passing both got the ids' orders and none of its narrowing, with a 200 on it
  // — see docs/ebay-api.md#orderids-excludes-every-other-parameter.
  if (
    data?.orderIds?.length &&
    (filters?.length || data.limit || data.offset || data.fieldGroups?.length)
  ) {
    throw new RequestError(
      "EBY_0003",
      "eBay order ids cannot be combined with any other order query parameter",
      {
        metadata: {
          context:
            "eBay's getOrders ignores filter, limit, offset and fieldGroups " +
            "when orderIds is set. Fetch the named orders and the filtered " +
            "page separately.",
        },
      }
    );
  }
  const res = await tryHandleRequest<GetEbayOrdersResponse>(
    {
      clientName,
      requestName: "ebay.orders.list",
      grantId,
      method: "GET",
      url: "/sell/fulfillment/v1/order",
      params: {
        ...(data?.orderIds ? { orderIds: data?.orderIds.join(",") } : {}),
        ...(data?.limit ? { limit: data?.limit } : {}),
        ...(data?.offset ? { offset: data?.offset } : {}),
        ...(data?.fieldGroups
          ? { fieldGroups: data?.fieldGroups.join(",") }
          : {}),
        ...(filters ? { filter: filters.join(",") } : {}),
      },
    },
    "EBY_0001",
    "Failed to fetch eBay orders"
  );
  return res.data;
};

export const getOrder = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  data: GetEbayOrderData
): Promise<EbayOrder> => {
  const res = await tryHandleRequest<EbayOrder>(
    {
      clientName,
      requestName: "ebay.orders.get",
      grantId,
      method: "GET",
      url: `/sell/fulfillment/v1/order/${data.orderId}`,
      params: {
        ...(data.fieldGroups
          ? { fieldGroups: data.fieldGroups.join(",") }
          : {}),
      },
    },
    "EBY_0002",
    "Failed to fetch eBay order"
  );
  return res.data;
};
