import { MUTATION_COST, OBJECT_COST } from "../utils/queryCost.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import {
  ShopifyBulkOperationGetStatusResponse,
  ShopifyCreateBulkOperationResponse,
} from "./types.js";

/**
 * `bulkQuery` must arrive already wrapped as `query: """ { … } """` —
 * `pricing.getByBulkOperation` is a worked example. It is written into the
 * mutation rather than passed as a variable, the one place here where that is
 * correct: the argument *is* a GraphQL document. Nothing can escape it on the
 * caller's behalf, so treat it the way you would treat SQL you assembled
 * yourself.
 */
export const createQuery = async (clientName: string, bulkQuery: string) => {
  const query = `
    mutation {
    bulkOperationRunQuery(
      ${bulkQuery}
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`;

  return await handleGraphQLRequest<ShopifyCreateBulkOperationResponse>(
    clientName,
    "SHO_0047",
    "Failed to create Shopify bulk operation query",
    // The bulk query itself is priced against the bulk operation's own limits,
    // not against this request.
    MUTATION_COST + 3 * OBJECT_COST,
    "shopify.bulkOperation.runQuery",
    query
  );
};

export const getStatus = async (clientName: string, operationId: string) => {
  const query = `
    query bulkOperation($id: ID!) {
      node(id: $id) {
        ... on BulkOperation {
          id
          status
          errorCode
          createdAt
          completedAt
          objectCount
          fileSize
          url
        }
      }
    }`;

  const res = await handleGraphQLRequest<ShopifyBulkOperationGetStatusResponse>(
    clientName,
    "SHO_0048",
    "Failed to get Shopify bulk operation status",
    OBJECT_COST,
    "shopify.bulkOperation.getStatus",
    query,
    { id: operationId }
  );
  return res;
};
