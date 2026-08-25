import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import {
  AmazonShipmentCancellationResponse,
  AmazonPurchaseShipmentResponse,
  AmazonPurchaseShipmentRequest,
  AmazonGetRatesRequest,
  AmazonGetRatesResponse,
} from "./types.js";

/** Amazon returns only viable rates, so an empty list is an answer, not a fault. */
export const getAmazonRates = async (
  clientName: string,
  awsRegion: AwsRegion,
  data: AmazonGetRatesRequest,
  pii = false,
  /**
   * Amazon Shipping business id, e.g. `AmazonShipping_US` / `_UK` / `_IN`.
   * Omitted by default — Amazon resolves it from the account when absent.
   */
  businessId?: string
): Promise<AmazonGetRatesResponse> => {
  const res = await handleSpapiRequest<AmazonGetRatesResponse>(
    clientName,
    awsRegion,
    "AMZ_0066",
    "Failed to get Amazon shipping rates",
    {
      endpoint: "shippingGetRates",
      url: `/shipping/v2/shipments/rates`,
      data,
      headers: businessId
        ? { "x-amzn-shipping-business-id": businessId }
        : undefined,
      dataElements: pii ? ["shippingAddress", "buyerInfo"] : undefined,
    },
    "amazonSpapi.shipping.getRates"
  );
  return res.data;
};

export const purchaseShipment = async (
  clientName: string,
  awsRegion: AwsRegion,
  data: AmazonPurchaseShipmentRequest
): Promise<AmazonPurchaseShipmentResponse> => {
  const res = await handleSpapiRequest<AmazonPurchaseShipmentResponse>(
    clientName,
    awsRegion,
    "AMZ_0005",
    "Failed to purchase Amazon shipment",
    {
      endpoint: "shippingCreateShipment",
      url: `/shipping/v2/shipments`,
      data,
    },
    "amazonSpapi.shipping.createShipment"
  );
  return res.data;
};

export const cancelShipment = async (
  clientName: string,
  awsRegion: AwsRegion,
  shipmentId: string,
  /** Amazon Shipping business id; omitted by default. */
  businessId?: string
): Promise<AmazonShipmentCancellationResponse> => {
  const res = await handleSpapiRequest<AmazonShipmentCancellationResponse>(
    clientName,
    awsRegion,
    "AMZ_0006",
    "Failed to cancel Amazon shipment",
    {
      endpoint: "shippingCancelShipment",
      url: `/shipping/v2/shipments/${shipmentId}/cancel`,
      headers: {
        ...(businessId ? { "x-amzn-shipping-business-id": businessId } : {}),
        "Content-Type": "application/json",
      },
    },
    "amazonSpapi.shipping.cancelShipment"
  );
  return res.data;
};
