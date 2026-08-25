import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { StripePaymentMethod } from "../types.js";
import { stripeFormEncode } from "../encode.js";

interface StripePaymentMethodList {
  object: "list";
  data: StripePaymentMethod[];
  has_more: boolean;
  url: string;
}

export const retrieve = async (
  clientName: string,
  paymentMethodId: string
): Promise<StripePaymentMethod> => {
  const res = await tryHandleRequest<StripePaymentMethod>(
    {
      clientName,
      requestName: "stripe.paymentMethods.retrieve",
      method: "GET",
      url: `/v1/payment_methods/${paymentMethodId}`,
    },
    "STR_0040",
    `Failed to retrieve Stripe PaymentMethod ${paymentMethodId}`
  );
  return res.data;
};

export const attach = async (
  clientName: string,
  paymentMethodId: string,
  customerId: string,
  idempotencyKey: string
): Promise<StripePaymentMethod> => {
  const res = await tryHandleRequest<StripePaymentMethod>(
    {
      clientName,
      requestName: "stripe.paymentMethods.attach",
      method: "POST",
      url: `/v1/payment_methods/${paymentMethodId}/attach`,
      data: stripeFormEncode({ customer: customerId }),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0041",
    `Failed to attach Stripe PaymentMethod ${paymentMethodId}`
  );
  return res.data;
};

export const detach = async (
  clientName: string,
  paymentMethodId: string,
  idempotencyKey: string
): Promise<StripePaymentMethod> => {
  const res = await tryHandleRequest<StripePaymentMethod>(
    {
      clientName,
      requestName: "stripe.paymentMethods.detach",
      method: "POST",
      url: `/v1/payment_methods/${paymentMethodId}/detach`,
      data: stripeFormEncode({}),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0042",
    `Failed to detach Stripe PaymentMethod ${paymentMethodId}`
  );
  return res.data;
};

interface ListInput {
  customer: string;
  type?: string;
  limit?: number;
  starting_after?: string;
}

export const list = async (
  clientName: string,
  params: ListInput
): Promise<StripePaymentMethodList> => {
  const res = await tryHandleRequest<StripePaymentMethodList>(
    {
      clientName,
      requestName: "stripe.paymentMethods.list",
      method: "GET",
      url: "/v1/payment_methods",
      params: {
        customer: params.customer,
        ...(params.type ? { type: params.type } : {}),
        ...(params.limit ? { limit: String(params.limit) } : {}),
        ...(params.starting_after
          ? { starting_after: params.starting_after }
          : {}),
      },
    },
    "STR_0043",
    "Failed to list Stripe PaymentMethods"
  );
  return res.data;
};
