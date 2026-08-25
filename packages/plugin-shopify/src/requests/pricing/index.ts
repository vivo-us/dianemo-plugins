import { shopifyPollBulkOperationUtility } from "../bulkOperation/utilities.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import shopify from "../index.js";
import {
  MUTATION_COST,
  OBJECT_COST,
  connectionCost,
} from "../utils/queryCost.js";
import {
  ShopifySetPricingResponse,
  ShopifySetPricingVariables,
} from "./types.js";

export const getByBulkOperation = async (clientName: string) => {
  const query = `
      query: """
      {
        productVariants {
          edges {
            node {
              id                # Variant ID (For Price Updates)
              sku               # Your ERP Match Key
              price             # Current Shopify Price
              compareAtPrice    # Current 'Sale' Price
              product {
                id              # Product ID (For Price Updates)
              }
              inventoryItem {
                id              # Inventory ID (For Stock Updates - Critical!)
              }
            }
          }
        }
      }
      """`;

  const res = await shopify.bulkOperation.createQuery(clientName, query);
  return await shopifyPollBulkOperationUtility(clientName, res.data);
};

export const set = async (
  clientName: string,
  variables: ShopifySetPricingVariables
) => {
  const query = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        product {
          id
        }
        productVariants {
          id
          metafields(first: 2) {
            edges {
              node {
                namespace
                key
                value
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }`;
  const res = await handleGraphQLRequest<ShopifySetPricingResponse>(
    clientName,
    "SHO_0046",
    "Failed to update Shopify product variant pricing",
    MUTATION_COST + 4 * OBJECT_COST + connectionCost(2, OBJECT_COST),
    "shopify.pricing.productVariantsBulkUpdate",
    query,
    variables
  );

  return res;
};
