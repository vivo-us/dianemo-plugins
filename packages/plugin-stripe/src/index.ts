import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerStripeTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "stripe",
  registerTemplate: registerStripeTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerStripeTemplate } from "./client.js";
export * from "./requests/index.js";
export { getStripeWebhookSecret } from "./client.js";
export { getStripePublishableKey } from "./client.js";
export { clearStripeCredentialCache } from "./client.js";
export { clearAllStripeCredentialCaches } from "./client.js";
export { STRIPE_API_VERSION } from "./client.js";

export * from "./requests/types.js";
