import * as paymentIntents from "./paymentIntents/index.js";
import * as paymentMethods from "./paymentMethods/index.js";
import * as setupIntents from "./setupIntents/index.js";
import type { StripeClientLookup } from "./types.js";
import * as customers from "./customers/index.js";
import { buildClientName } from "@dianemo/core";
import * as refunds from "./refunds/index.js";

export { paymentIntents, setupIntents, refunds, customers, paymentMethods };
export type {
  StripeCharge,
  StripeCustomer,
  StripeError,
  StripeErrorEnvelope,
  StripeNextAction,
  StripePaymentIntent,
  StripePaymentMethod,
  StripeRefund,
  StripeSetupIntent,
  StripeClientLookup,
} from "./types.js";
export { stripeFormEncode } from "./encode.js";

export function stripeClientName(lookup: StripeClientLookup): string {
  return buildClientName("stripe", {
    organizationId: lookup.organizationId,
    instanceId: lookup.stripeAccountId,
  } as Parameters<typeof buildClientName>[1]);
}
