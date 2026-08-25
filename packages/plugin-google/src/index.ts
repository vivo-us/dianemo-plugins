import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerGoogleTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "google",
  registerTemplate: registerGoogleTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerGoogleTemplate } from "./client.js";
export * from "./requests/index.js";
export * from "./requests/types.js";
