import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerMainfreightTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "mainfreight",
  registerTemplate: registerMainfreightTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerMainfreightTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/inboundOrders/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/outboundOrders/types.js";
export * from "./requests/tracking/types.js";
export * from "./requests/types.js";
