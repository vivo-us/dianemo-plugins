// Only the fields this plugin reads, and as API version 2022-11-15 shapes them:
// docs/stripe-api.md#the-stripe-version-pin-and-why-it-is-2022-11-15

export interface StripeError {
  type?: string;
  code?: string;
  decline_code?: string;
  message?: string;
  param?: string;
  payment_intent?: { id: string; status: string };
}

export interface StripeErrorEnvelope {
  error?: StripeError;
}

export interface StripeNextAction {
  type: string;
  use_stripe_sdk?: Record<string, unknown>;
  redirect_to_url?: { url: string; return_url: string };
  [k: string]: unknown;
}

export interface StripeCharge {
  id: string;
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  currency: string;
  status: string;
  payment_intent: string | null;
  payment_method: string | null;
  refunded: boolean;
  outcome?: { network_status?: string; reason?: string; type?: string };
  [k: string]: unknown;
}

export interface StripePaymentIntent {
  id: string;
  object: "payment_intent";
  amount: number;
  amount_capturable: number;
  amount_received: number;
  capture_method: "automatic" | "automatic_async" | "manual";
  client_secret: string | null;
  currency: string;
  customer: string | null;
  payment_method: string | null;
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "requires_capture"
    | "canceled"
    | "succeeded";
  next_action: StripeNextAction | null;
  latest_charge: string | null;
  last_payment_error: StripeError | null;
  metadata: Record<string, string>;
  [k: string]: unknown;
}

export interface StripeSetupIntent {
  id: string;
  object: "setup_intent";
  client_secret: string | null;
  customer: string | null;
  payment_method: string | null;
  usage: "off_session" | "on_session";
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "canceled"
    | "succeeded";
  next_action: StripeNextAction | null;
  latest_attempt: string | null;
  last_setup_error: StripeError | null;
  metadata: Record<string, string>;
  [k: string]: unknown;
}

export interface StripeRefund {
  id: string;
  object: "refund";
  amount: number;
  currency: string;
  payment_intent: string | null;
  charge: string | null;
  status: "pending" | "succeeded" | "failed" | "canceled" | "requires_action";
  failure_reason?: string;
  [k: string]: unknown;
}

export interface StripeCustomer {
  id: string;
  object: "customer";
  email: string | null;
  name: string | null;
  metadata: Record<string, string>;
  [k: string]: unknown;
}

export interface StripePaymentMethod {
  id: string;
  object: "payment_method";
  type: string;
  customer: string | null;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  [k: string]: unknown;
}

export interface StripeClientLookup {
  /** `null` for system-tenant / platform-mode deployments; becomes the `_` segment. */
  organizationId: string | null;
  stripeAccountId: string;
}
