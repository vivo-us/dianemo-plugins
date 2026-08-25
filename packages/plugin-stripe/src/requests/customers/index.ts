import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { StripeCustomer } from "../types.js";
import { stripeFormEncode } from "../encode.js";

interface CreateInput {
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export const create = async (
  clientName: string,
  data: CreateInput,
  idempotencyKey: string
): Promise<StripeCustomer> => {
  const res = await tryHandleRequest<StripeCustomer>(
    {
      clientName,
      requestName: "stripe.customers.create",
      method: "POST",
      url: "/v1/customers",
      data: stripeFormEncode(data),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0030",
    "Failed to create Stripe customer"
  );
  return res.data;
};

export const retrieve = async (
  clientName: string,
  customerId: string
): Promise<StripeCustomer> => {
  const res = await tryHandleRequest<StripeCustomer>(
    {
      clientName,
      requestName: "stripe.customers.retrieve",
      method: "GET",
      url: `/v1/customers/${customerId}`,
    },
    "STR_0031",
    `Failed to retrieve Stripe customer ${customerId}`
  );
  return res.data;
};

interface UpdateInput {
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export const update = async (
  clientName: string,
  customerId: string,
  data: UpdateInput,
  idempotencyKey: string
): Promise<StripeCustomer> => {
  const res = await tryHandleRequest<StripeCustomer>(
    {
      clientName,
      requestName: "stripe.customers.update",
      method: "POST",
      url: `/v1/customers/${customerId}`,
      data: stripeFormEncode(data),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0032",
    `Failed to update Stripe customer ${customerId}`
  );
  return res.data;
};
