import handleGraphQLRequest from "../handleGraphQLRequest.js";
import gqlString from "../utils/gqlString.js";
import { RequestError } from "@dianemo/core";
import {
  AcceptOrderParams,
  AcceptWayfairOrderResponse,
  WayfairAcceptOrderData,
  WayfairPurchaseOrdersData,
  WayfairPurchaseOrdersResponse,
} from "./types.js";

/**
 * Fetches dropship purchase orders. `fromDate`/`toDate` are ISO dates bounding
 * `poDate`, and both go into Wayfair's `filters` list — `purchaseOrders` takes no
 * `fromDate`/`toDate` arguments of its own, though a different query does, which
 * is why they looked correct. `lessThanOrEqualTo` rests on a third party's schema
 * introspection, not Wayfair's own words, and is still unconfirmed.
 *
 * See docs/wayfair-api.md#purchaseorders-filters.
 */
export const getOrders = async (
  clientName: string,
  options?: { limit?: number; fromDate?: string; toDate?: string }
): Promise<WayfairPurchaseOrdersResponse> => {
  const limit = options?.limit ?? 50;
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RequestError("WFR_0004", "Invalid Wayfair purchase order limit", {
      metadata: {
        context: `limit must be a positive integer, got ${limit}`,
      },
    });
  }
  const filters = [
    options?.fromDate
      ? `{ field: poDate, greaterThanOrEqualTo: ${gqlString(
          options.fromDate
        )} }`
      : "",
    options?.toDate
      ? `{ field: poDate, lessThanOrEqualTo: ${gqlString(options.toDate)} }`
      : "",
  ].filter(Boolean);
  const args = [
    `limit: ${limit}`,
    filters.length ? `filters: [${filters.join(", ")}]` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return await handleGraphQLRequest<WayfairPurchaseOrdersData>(
    clientName,
    "wayfair.orders.list",
    "WFR_0002",
    "Failed to fetch Wayfair purchase orders",
    `query purchaseOrders {
          purchaseOrders(${args}) {
            poNumber
            poDate
            estimatedShipDate
            customerName
            orderType
            products {
              partNumber
              quantity
              price
            }
          }
        }`
  );
};

/**
 * Accepts a purchase order at the given ship speed. Wayfair answers with a feed
 * handle rather than a result: `status` is the state of the submission, not of
 * the acceptance, and `errors` fills in asynchronously as the feed processes.
 */
export const acceptOrder = async (
  clientName: string,
  params: AcceptOrderParams
): Promise<AcceptWayfairOrderResponse> => {
  return await handleGraphQLRequest<WayfairAcceptOrderData>(
    clientName,
    "wayfair.orders.accept",
    "WFR_0006",
    "Failed to accept Wayfair purchase order",
    `mutation accept($poNumber: String!, $shipSpeed: ShipSpeed!, $lineItems: [AcceptedLineItemInput!]!) {
      purchaseOrders {
        accept(poNumber: $poNumber, shipSpeed: $shipSpeed, lineItems: $lineItems) {
          id
          handle
          status
          submittedAt
          completedAt
          itemCount
          errorCount
          errors {
            key
            message
          }
          completedCount
          completed {
            key
            message
          }
          processingCount
          processing {
            key
            message
          }
        }
      }
    }`,
    { ...params }
  );
};
