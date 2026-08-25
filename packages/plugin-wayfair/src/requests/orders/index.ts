import handleGraphQLRequest from "../handleGraphQLRequest.js";
import gqlString from "../utils/gqlString.js";
import { RequestError } from "@dianemo/core";
import {
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
