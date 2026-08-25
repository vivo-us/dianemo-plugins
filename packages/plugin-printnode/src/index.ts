import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerPrintNodeTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "printNode",
  registerTemplate: registerPrintNodeTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerPrintNodeTemplate } from "./client.js";
export * from "./requests/index.js";
export * from "./requests/types.js";
