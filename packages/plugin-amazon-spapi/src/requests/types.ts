import { SPAPIEndpointName } from "../utils/amazonSpapiData.js";
import { RestrictedResource } from "./auth/types.js";

export interface SPAPIRequestData {
  endpoint: SPAPIEndpointName;
  url: string;
  data?: unknown;
  params?: QueryData;
  /**
   * Restricted data to ask for. Set, the call is routed to the endpoint's
   * `:pii` sub-client and answered against a restricted data token minted for
   * exactly this path, method and element list.
   */
  dataElements?: RestrictedResource["dataElements"];
  headers?: Record<string, string>;
}

export type QueryData = {
  [key: string]: string | string[];
};
