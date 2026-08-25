import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerUpsTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "ups",
  registerTemplate: registerUpsTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerUpsTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/addressValidation/types.js";
export * from "./requests/packageTracking/types.js";
export * from "./requests/pickup/types.js";
export * from "./requests/rating/types.js";
export * from "./requests/shipping/types.js";
export * from "./requests/types.js";

// Defined by more than one endpoint family with different shapes; the barrel
// exports the general one and the others stay on their own module path.
export type { UpsAddress } from "./requests/shipping/types.js";
