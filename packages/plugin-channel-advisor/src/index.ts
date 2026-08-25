import { registerChannelAdvisorTemplate } from "./client.js";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "channelAdvisor",
  registerTemplate: registerChannelAdvisorTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerChannelAdvisorTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/auth/types.js";
export * from "./requests/distributionCenters/types.js";
export * from "./requests/orders/customFields/types.js";
export * from "./requests/orders/fulfillments/types.js";
export * from "./requests/orders/shipments/types.js";
export * from "./requests/orders/shippingRates/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/products/attributes/types.js";
export * from "./requests/products/bulkUpload/types.js";
export * from "./requests/products/bundleComponents/types.js";
export * from "./requests/products/children/types.js";
export * from "./requests/products/dcQuantities/types.js";
export * from "./requests/products/images/types.js";
export * from "./requests/products/labels/types.js";
export * from "./requests/products/types.js";
export * from "./requests/profiles/types.js";
export * from "./requests/types.js";
