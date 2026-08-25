import handleGraphQLRequest from "../handleGraphQLRequest.js";
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
  CreateWebhookResponse,
  CreateWebhookVariables,
  DeleteWebhookResponse,
  GetWebhookResponse,
  GetWebhooksOptions,
  GetWebhooksResponse,
  UpdateWebhookResponse,
  UpdateWebhookVariables,
} from "./types.js";

const getSubscriptionQuery = `{
  id
  topic
  filter
  format
  endpoint {
    __typename
    ... on WebhookHttpEndpoint {
      callbackUrl
    }
  }
}`;

const SUBSCRIPTION_COST = 2 * OBJECT_COST;

/**
 * Not aliased. This read `errors: userErrors`, so the payload arrived under
 * `errors` while every response type in ./types.js declares `userErrors` — a
 * caller checking `userErrors.length` silently found nothing, and a webhook
 * Shopify had refused looked like one it had created.
 */
const userErrorsQuery = `userErrors {
  field
  message
}`;

/**
 * `webhookSubscriptions` is one of the few Shopify connections with no `query`
 * argument, so the one `GetManyBasicOptions` carries is dropped here.
 */
const webhookArgumentTypes = (() => {
  const { query: _query, ...basic } = basicListArgumentTypes(
    "WebhookSubscriptionSortKeys"
  );
  return {
    ...basic,
    callbackUrl: "URL",
    format: "WebhookSubscriptionFormat",
    topics: "[WebhookSubscriptionTopic!]",
  };
})();

export const getWebhooks = async (
  clientName: string,
  options?: GetWebhooksOptions
) => {
  const defaultOptions = { first: 10 };
  const mergedOptions = { ...defaultOptions, ...options };
  const args = buildListArguments(mergedOptions, webhookArgumentTypes);
  const query = `query webhookSubscriptions${args.declarations} {
    webhookSubscriptions${args.arguments} {
      edges {
        node ${getSubscriptionQuery}
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;
  return await handleGraphQLRequest<GetWebhooksResponse>(
    clientName,
    "SHO_0015",
    "Failed to fetch Shopify webhook subscriptions",
    connectionCost(listPageSize(mergedOptions), SUBSCRIPTION_COST),
    "shopify.webhooks.list",
    query,
    args.variables
  );
};

export const getWebhook = async (clientName: string, id: string) => {
  const query = `query webhookSubscription($id: ID!) {
    webhookSubscription(id: $id) ${getSubscriptionQuery}
  }`;
  return await handleGraphQLRequest<GetWebhookResponse>(
    clientName,
    "SHO_0016",
    "Failed to fetch Shopify webhook subscription",
    SUBSCRIPTION_COST,
    "shopify.webhooks.get",
    query,
    { id }
  );
};

export const createWebhook = async (
  clientName: string,
  variables: CreateWebhookVariables
) => {
  const query = `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
      webhookSubscription ${getSubscriptionQuery}
      ${userErrorsQuery}
    }
  }`;
  return await handleGraphQLRequest<CreateWebhookResponse>(
    clientName,
    "SHO_0017",
    "Failed to create Shopify webhook subscription",
    MUTATION_COST + 2 * OBJECT_COST + SUBSCRIPTION_COST,
    "shopify.webhooks.create",
    query,
    variables
  );
};

export const updateWebhook = async (
  clientName: string,
  variables: UpdateWebhookVariables
) => {
  const query = `mutation webhookSubscriptionUpdate($id: ID!, $webhookSubscription: WebhookSubscriptionInput!) {
    webhookSubscriptionUpdate(id: $id, webhookSubscription: $webhookSubscription) {
      webhookSubscription ${getSubscriptionQuery}
      ${userErrorsQuery}
    }
  }`;
  return await handleGraphQLRequest<UpdateWebhookResponse>(
    clientName,
    "SHO_0018",
    "Failed to update Shopify webhook subscription",
    MUTATION_COST + 2 * OBJECT_COST + SUBSCRIPTION_COST,
    "shopify.webhooks.update",
    query,
    variables
  );
};

export const deleteWebhook = async (clientName: string, id: string) => {
  const query = `mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      deletedWebhookSubscriptionId
      ${userErrorsQuery}
    }
  }`;
  return await handleGraphQLRequest<DeleteWebhookResponse>(
    clientName,
    "SHO_0019",
    "Failed to delete Shopify webhook subscription",
    MUTATION_COST + 2 * OBJECT_COST,
    "shopify.webhooks.delete",
    query,
    { id }
  );
};
