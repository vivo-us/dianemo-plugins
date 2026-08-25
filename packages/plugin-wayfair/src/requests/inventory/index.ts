import { GetWayfairInventoryResponse, WayfairInventoryData } from "./types.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { RequestError } from "@dianemo/core";

const PAGE_SIZE = 100;

/**
 * Fetches a page of inventory. `page` is 1-based, matching the offset Wayfair
 * pages on: page 1 is `offset: 0`. `PAGE_SIZE` is passed explicitly because
 * Wayfair defaults to 10 rows when no `limit` is given — see
 * docs/wayfair-api.md#paging-defaults.
 */
export const getInventory = async (
  clientName: string,
  page = 1
): Promise<GetWayfairInventoryResponse> => {
  // Refused rather than clamped: a caller silently handed page 1 instead has no
  // way to see that its paging is off by one for every page after it.
  if (!Number.isInteger(page) || page < 1) {
    throw new RequestError("WFR_0003", "Invalid Wayfair inventory page", {
      metadata: {
        context: `page is 1-based and must be a positive integer, got ${page}`,
      },
    });
  }
  return await handleGraphQLRequest<WayfairInventoryData>(
    clientName,
    "wayfair.inventory.list",
    "WFR_0001",
    "Failed to fetch Wayfair inventory data",
    `query inventory {
            inventory(
                limit: ${PAGE_SIZE},
                offset: ${(page - 1) * PAGE_SIZE},
            ) {
              supplierPartNumber
              quantityOnHand
              quantityBackordered
              quantityOnOrder
              discontinued
            }
          }`
  );
};
