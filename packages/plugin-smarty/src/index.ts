import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerSmartyTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "smarty",
  registerTemplate: registerSmartyTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerSmartyTemplate } from "./client.js";
export * from "./requests/index.js";
export * from "./requests/types.js";
