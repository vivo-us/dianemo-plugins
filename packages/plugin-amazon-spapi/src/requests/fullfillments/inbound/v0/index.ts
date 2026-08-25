import { AwsRegion } from "../../../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../../../handleSpapiRequest.js";
import {
  AmazonFbaInboundFulfillmentShipmentResponseV0,
  AmazonInboundFulfillmentBaseResponseV0,
  AmazonInboundShipmentDetailsV0,
  getShipmentsV0QueryOptions,
} from "./types.js";

/**
 * `queryOptions` is required, not optional: v0 rejects the call without
 * `QueryType` and `MarketplaceId`, both of which the type already makes
 * mandatory — so a no-argument call compiled and then spent a token on a
 * guaranteed 400.
 */
export const getShipments = async (
  clientName: string,
  awsRegion: AwsRegion,
  queryOptions: getShipmentsV0QueryOptions
): Promise<AmazonFbaInboundFulfillmentShipmentResponseV0> => {
  const res =
    await handleSpapiRequest<AmazonFbaInboundFulfillmentShipmentResponseV0>(
      clientName,
      awsRegion,
      "AMZ_0061",
      "Failed to get Amazon FBA inbound shipments",
      {
        endpoint: "inboundGetShipments",
        url: `/fba/inbound/v0/shipments`,
        params: queryOptions,
      },
      "amazonSpapi.inbound.getShipments"
    );
  return res.data;
};

/**
 * v0 returns a `nextToken` whether or not there are more items, so paging on its
 * presence never terminates — compare each page against the last instead.
 *
 * `queryOptions` is PascalCase because v0's parameters are: the lowercase
 * `nextToken` this used to accept is not a parameter Amazon reads, so every
 * "next" page came back as page one.
 */
export const getShipmentItemsByShipmentId = async (
  clientName: string,
  awsRegion: AwsRegion,
  shipmentId: string,
  queryOptions: {
    MarketplaceId: string;
    NextToken?: string;
  }
): Promise<
  AmazonInboundFulfillmentBaseResponseV0<AmazonInboundShipmentDetailsV0>
> => {
  const res = await handleSpapiRequest<
    AmazonInboundFulfillmentBaseResponseV0<AmazonInboundShipmentDetailsV0>
  >(
    clientName,
    awsRegion,
    "AMZ_0062",
    "Failed to get Amazon FBA inbound shipment items",
    {
      endpoint: "inboundGetShipmentItemsByShipmentIdv0",
      url: `/fba/inbound/v0/shipments/${shipmentId}/items`,
      params: queryOptions,
    },
    "amazonSpapi.inbound.getShipmentItemsByShipmentIdV0"
  );
  return res.data;
};
