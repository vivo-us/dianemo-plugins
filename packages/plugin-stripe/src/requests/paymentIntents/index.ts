import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { StripePaymentIntent } from "../types.js";
import { stripeFormEncode } from "../encode.js";

interface CreateInput {
  amount: number;
  currency: string;
  customer?: string;
  payment_method?: string;
  payment_method_types?: string[];
  capture_method?: "automatic" | "manual" | "automatic_async";
  confirm?: boolean;
  off_session?: boolean;
  return_url?: string;
  setup_future_usage?: "on_session" | "off_session";
  description?: string;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  metadata?: Record<string, string>;
}

export const create = async (
  clientName: string,
  data: CreateInput,
  idempotencyKey: string
): Promise<StripePaymentIntent> => {
  const res = await tryHandleRequest<StripePaymentIntent>(
    {
      clientName,
      requestName: "stripe.paymentIntents.create",
      method: "POST",
      url: "/v1/payment_intents",
      data: stripeFormEncode(data),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0001",
    "Failed to create Stripe PaymentIntent"
  );
  return res.data;
};

export const retrieve = async (
  clientName: string,
  paymentIntentId: string
): Promise<StripePaymentIntent> => {
  const res = await tryHandleRequest<StripePaymentIntent>(
    {
      clientName,
      requestName: "stripe.paymentIntents.retrieve",
      method: "GET",
      url: `/v1/payment_intents/${paymentIntentId}`,
    },
    "STR_0002",
    `Failed to retrieve Stripe PaymentIntent ${paymentIntentId}`
  );
  return res.data;
};

export const capture = async (
  clientName: string,
  paymentIntentId: string,
  data: { amount_to_capture?: number } | undefined,
  idempotencyKey: string
): Promise<StripePaymentIntent> => {
  const res = await tryHandleRequest<StripePaymentIntent>(
    {
      clientName,
      requestName: "stripe.paymentIntents.capture",
      method: "POST",
      url: `/v1/payment_intents/${paymentIntentId}/capture`,
      data: stripeFormEncode(data ?? {}),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0003",
    `Failed to capture Stripe PaymentIntent ${paymentIntentId}`
  );
  return res.data;
};

export const cancel = async (
  clientName: string,
  paymentIntentId: string,
  data: { cancellation_reason?: string } | undefined,
  idempotencyKey: string
): Promise<StripePaymentIntent> => {
  const res = await tryHandleRequest<StripePaymentIntent>(
    {
      clientName,
      requestName: "stripe.paymentIntents.cancel",
      method: "POST",
      url: `/v1/payment_intents/${paymentIntentId}/cancel`,
      data: stripeFormEncode(data ?? {}),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0004",
    `Failed to cancel Stripe PaymentIntent ${paymentIntentId}`
  );
  return res.data;
};

interface ConfirmInput {
  payment_method?: string;
  return_url?: string;
  off_session?: boolean;
}

export const confirm = async (
  clientName: string,
  paymentIntentId: string,
  data: ConfirmInput | undefined,
  idempotencyKey: string
): Promise<StripePaymentIntent> => {
  const res = await tryHandleRequest<StripePaymentIntent>(
    {
      clientName,
      requestName: "stripe.paymentIntents.confirm",
      method: "POST",
      url: `/v1/payment_intents/${paymentIntentId}/confirm`,
      data: stripeFormEncode(data ?? {}),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0005",
    `Failed to confirm Stripe PaymentIntent ${paymentIntentId}`
  );
  return res.data;
};
