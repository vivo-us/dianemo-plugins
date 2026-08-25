import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { GetManyBasicOptions } from "../types.js";
import {
  basicListArgumentTypes,
  buildListArguments,
  listPageSize,
} from "../utils/listArguments.js";
import {
  MUTATION_COST,
  OBJECT_COST,
  connectionCost,
} from "../utils/queryCost.js";
import {
  GetManyInventoryItemsResponse,
  ShopifySetQuantitiesInput,
  ShopifySetQuantitiesResponse,
} from "./types.js";

const itemFields = `{
          id
          sku
          variant {
            id
            product {
              id
              status
            }
          }
        }`;

const ITEM_COST = 3 * OBJECT_COST;

export const getMany = async (
  clientName: string,
  options?: GetManyBasicOptions
) => {
  const defaultOptions = { first: 10 };
  const mergedOptions = { ...defaultOptions, ...options };
  const args = buildListArguments(
    mergedOptions,
    basicListArgumentTypes("InventoryItemSortKeys")
  );

  const query = `query inventoryItems${args.declarations} {
    inventoryItems${args.arguments} {
        edges {
          node ${itemFields}
        }
          pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;

  return await handleGraphQLRequest<GetManyInventoryItemsResponse>(
    clientName,
    "SHO_0042",
    "Failed to fetch Shopify inventory items",
    connectionCost(listPageSize(mergedOptions), ITEM_COST),
    "shopify.inventory.list",
    query,
    args.variables
  );
};

export const setQuantities = async (
  clientName: string,
  variables: ShopifySetQuantitiesInput
) => {
  const query = `mutation InventorySet($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup {
          createdAt
          reason
          referenceDocumentUri
          changes {
            name
            delta
          }
        }
        userErrors {
          field
          message
        }
      }
    }`;
  const input = { input: variables };
  const res = await handleGraphQLRequest<ShopifySetQuantitiesResponse>(
    clientName,
    "SHO_0050",
    "Failed to set Shopify inventory quantities",
    MUTATION_COST + 4 * OBJECT_COST,
    "shopify.inventory.setQuantities",
    query,
    input
  );

  return res;
};
