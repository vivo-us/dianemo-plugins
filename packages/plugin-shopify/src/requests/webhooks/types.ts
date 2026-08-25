import { GetManyBasicOptions, GetManyResponse } from "../types.js";

type WebhookFormat = "JSON" | "XML";

type WebhookMetafield = {
  key: string;
  namespace?: string;
};

interface WebhookGraphQLError {
  field: string;
  message: string;
}

interface WebhookCreateUpdateEndpoint {
  __typename: "WebhookHttpEndpoint";
  callbackUrl: string;
}

interface ExistingWebhookSubscription {
  id: string;
  topic: string;
  filter: string | null;
  format: WebhookFormat;
  endpoint: WebhookCreateUpdateEndpoint;
}

/** `webhookSubscriptions` has no search argument, so `query` is omitted. */
export interface GetWebhooksOptions extends Omit<GetManyBasicOptions, "query"> {
  callbackUrl?: string;
  format?: WebhookFormat;
  topics?: string[];
}

export interface GetWebhooksResponse {
  webhookSubscriptions: GetManyResponse<ExistingWebhookSubscription>;
}

export interface GetWebhookResponse {
  webhookSubscription: ExistingWebhookSubscription;
}

export interface WebhookSubscription {
  callbackUrl: string;
  filter?: string;
  format: WebhookFormat;
  includeFields?: string[];
  metafieldNamespaces?: string[];
  metafields?: WebhookMetafield[];
}

export interface CreateWebhookVariables {
  topic: string;
  webhookSubscription: WebhookSubscription;
}

export interface CreateWebhookResponse {
  webhookSubscriptionCreate: {
    webhookSubscription: ExistingWebhookSubscription;
    userErrors: WebhookGraphQLError[];
  };
}

export interface UpdateWebhookVariables {
  id: string;
  webhookSubscription: WebhookSubscription;
}

export interface UpdateWebhookResponse {
  webhookSubscriptionUpdate: {
    webhookSubscription: ExistingWebhookSubscription;
    userErrors: WebhookGraphQLError[];
  };
}

export interface DeleteWebhookResponse {
  webhookSubscriptionDelete: {
    deletedWebhookSubscriptionId: string;
    userErrors: WebhookGraphQLError[];
  };
}
