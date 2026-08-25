import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { StripeSetupIntent } from "../types.js";
import { stripeFormEncode } from "../encode.js";

interface CreateInput {
  customer?: string;
  payment_method_types?: string[];
  usage?: "on_session" | "off_session";
  payment_method?: string;
  confirm?: boolean;
  return_url?: string;
  metadata?: Record<string, string>;
}

export const create = async (
  clientName: string,
  data: CreateInput,
  idempotencyKey: string
): Promise<StripeSetupIntent> => {
  const res = await tryHandleRequest<StripeSetupIntent>(
    {
      clientName,
      requestName: "stripe.setupIntents.create",
      method: "POST",
      url: "/v1/setup_intents",
      data: stripeFormEncode(data),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0010",
    "Failed to create Stripe SetupIntent"
  );
  return res.data;
};

export const retrieve = async (
  clientName: string,
  setupIntentId: string
): Promise<StripeSetupIntent> => {
  const res = await tryHandleRequest<StripeSetupIntent>(
    {
      clientName,
      requestName: "stripe.setupIntents.retrieve",
      method: "GET",
      url: `/v1/setup_intents/${setupIntentId}`,
    },
    "STR_0011",
    `Failed to retrieve Stripe SetupIntent ${setupIntentId}`
  );
  return res.data;
};

export const cancel = async (
  clientName: string,
  setupIntentId: string,
  idempotencyKey: string
): Promise<StripeSetupIntent> => {
  const res = await tryHandleRequest<StripeSetupIntent>(
    {
      clientName,
      requestName: "stripe.setupIntents.cancel",
      method: "POST",
      url: `/v1/setup_intents/${setupIntentId}/cancel`,
      data: stripeFormEncode({}),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0012",
    `Failed to cancel Stripe SetupIntent ${setupIntentId}`
  );
  return res.data;
};
