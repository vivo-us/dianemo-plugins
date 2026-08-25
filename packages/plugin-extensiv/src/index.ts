import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerExtensivTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "extensiv",
  registerTemplate: registerExtensivTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerExtensivTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/customers/types.js";
export * from "./requests/files/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/items/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/purchaseOrders/types.js";
export * from "./requests/receivers/types.js";
export * from "./requests/types.js";
