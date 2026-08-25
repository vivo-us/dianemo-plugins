import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerUspsTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "usps",
  registerTemplate: registerUspsTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerUspsTemplate } from "./client.js";
export * from "./requests/index.js";

// The way out of a payment token USPS has stopped accepting: nothing else
// evicts one before its seven-hour TTL.
export { clearCachedPaymentToken } from "./utils/uspsPaymentTokenCache.js";

export * from "./requests/addresses/types.js";
export * from "./requests/labels/types.js";
export * from "./requests/payments/types.js";
export * from "./requests/pickups/types.js";
export * from "./requests/rates/types.js";
export * from "./requests/tracking/types.js";
export * from "./requests/types.js";
