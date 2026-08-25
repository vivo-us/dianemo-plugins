import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerLabelaryTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "labelary",
  registerTemplate: registerLabelaryTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerLabelaryTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/types.js";
