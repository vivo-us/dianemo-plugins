import { tryHandleRequest } from "@dianemo/plugin-kit";
import { stripeFormEncode } from "../encode.js";
import type { StripeRefund } from "../types.js";

interface CreateInput {
  payment_intent?: string;
  charge?: string;
  amount?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  metadata?: Record<string, string>;
}

export const create = async (
  clientName: string,
  data: CreateInput,
  idempotencyKey: string
): Promise<StripeRefund> => {
  const res = await tryHandleRequest<StripeRefund>(
    {
      clientName,
      requestName: "stripe.refunds.create",
      method: "POST",
      url: "/v1/refunds",
      data: stripeFormEncode(data),
      headers: { "Idempotency-Key": idempotencyKey },
    },
    "STR_0020",
    "Failed to create Stripe refund"
  );
  return res.data;
};

export const retrieve = async (
  clientName: string,
  refundId: string
): Promise<StripeRefund> => {
  const res = await tryHandleRequest<StripeRefund>(
    {
      clientName,
      requestName: "stripe.refunds.retrieve",
      method: "GET",
      url: `/v1/refunds/${refundId}`,
    },
    "STR_0021",
    `Failed to retrieve Stripe refund ${refundId}`
  );
  return res.data;
};
