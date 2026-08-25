import { MUTATION_COST, OBJECT_COST } from "../utils/queryCost.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import {
  ShopifyCreateDraftOrder,
  ShopifyCreateDraftOrderResponseData,
  ShopifyGetDraftOrderResponseData,
} from "./types.js";

export const get = async (clientName: string, id: string) => {
  const query = `query draftOrder($id: ID!) {
    draftOrder(id: $id) {
      name
      id
    }
  }`;
  const res = await handleGraphQLRequest<ShopifyGetDraftOrderResponseData>(
    clientName,
    "SHO_0040",
    "Failed to fetch Shopify draft order",
    OBJECT_COST,
    "shopify.draftOrders.get",
    query,
    { id }
  );

  return res.data.draftOrder ? res.data : null;
};

export const create = async (
  clientName: string,
  data: ShopifyCreateDraftOrder
) => {
  const query = `mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
        }
      }
    }`;

  const variables = {
    input: {
      // Suppress automatic and code-based discounts by default, on the
      // assumption the caller has already priced the order. Both precede the
      // spread deliberately, so a caller can override them.
      acceptAutomaticDiscounts: false,
      allowDiscountCodesInCheckout: false,
      ...data,
    },
  };

  const res = await handleGraphQLRequest<ShopifyCreateDraftOrderResponseData>(
    clientName,
    "SHO_0038",
    "Failed to create Shopify draft order",
    MUTATION_COST + 2 * OBJECT_COST,
    "shopify.draftOrders.create",
    query,
    variables
  );

  return res.data.draftOrderCreate.draftOrder?.id || null;
};

export const deleteDraft = async (clientName: string, id: string) => {
  const query = `mutation draftOrderDelete($input: DraftOrderDeleteInput!) {
      draftOrderDelete(input: $input) {
        deletedId
      }
    }`;

  const variables = {
    input: {
      id,
    },
  };

  await handleGraphQLRequest<ShopifyCreateDraftOrderResponseData>(
    clientName,
    "SHO_0039",
    "Failed to delete Shopify draft order",
    MUTATION_COST + OBJECT_COST,
    "shopify.draftOrders.delete",
    query,
    variables
  );
};
