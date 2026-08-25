import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerUnisTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "unis",
  registerTemplate: registerUnisTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerUnisTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/inboundOrders/types.js";
export * from "./requests/outboundOrders/types.js";
export * from "./requests/receipts/types.js";
export * from "./requests/types.js";

// Two byte-identical declarations, which makes the star exports above ambiguous
// rather than merging them; the other stays on its own module path.
export type { UnisPaging } from "./requests/types.js";
