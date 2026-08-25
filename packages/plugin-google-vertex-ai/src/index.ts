import { registerGoogleVertexAiTemplate } from "./client.js";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "googleVertexAi",
  registerTemplate: registerGoogleVertexAiTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerGoogleVertexAiTemplate } from "./client.js";
export * from "./requests/index.js";
export * from "./requests/types.js";
