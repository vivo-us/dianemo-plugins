import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerHelpscoutTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "helpscout",
  registerTemplate: registerHelpscoutTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerHelpscoutTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/types.js";
