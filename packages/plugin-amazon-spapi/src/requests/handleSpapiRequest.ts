import { AwsRegion, spapiEndpoints } from "../utils/amazonSpapiData.js";
import { PII_SEGMENT, sellingPartnerIdOf } from "./clientName.js";
import { QueryData, SPAPIRequestData } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import URL from "node:url";

/**
 * `clientName` is the account's base name from `buildClientName("amazonSpapi",
 * creds)`; the region and endpoint segments name the sub-client that carries
 * this call's rate limit, so they are appended here rather than by the caller.
 */
const handleSpapiRequest = async <T = unknown>(
  clientName: string,
  awsRegion: AwsRegion,
  code: string,
  message: string,
  data: SPAPIRequestData,
  requestName: string
) => {
  // Restricted data goes to the endpoint's `:pii` sub-client, the only leaf
  // whose token core does not overwrite — see client.ts.
  const restricted = Boolean(data.dataElements?.length);
  if (restricted && !spapiEndpoints[data.endpoint].restricted) {
    throw new RequestError(
      "AMZ_0074",
      `Amazon endpoint "${data.endpoint}" is not marked as a restricted operation, so the template built no ":${PII_SEGMENT}" client for it and the request would go out with an unrestricted token. Mark it \`restricted: true\` in spapiEndpoints if Amazon documents it as one.`,
      { metadata: { endpoint: data.endpoint, requestName } }
    );
  }
  return await tryHandleRequest<T>(
    {
      clientName: `${clientName}:${awsRegion}:${data.endpoint}${restricted ? `:${PII_SEGMENT}` : ""}`,
      requestName,
      // The grant is per selling partner, which is the alias segment of the
      // client name — not the name itself, which also carries the org.
      grantId: sellingPartnerIdOf(clientName),
      method: spapiEndpoints[data.endpoint].method,
      url: `${data.url}${data.params ? `?${sortQueryData(data.params)}` : ""}`,
      data: data.data,
      // Merged over the client's defaults key by key, so a per-request header
      // adds to them rather than replacing the set every call needs.
      headers: data.headers,
      metadata: { dataElements: data.dataElements },
    },
    code,
    message
  );
};

const sortQueryData = (queryData: QueryData): string => {
  const sortedKeys = Object.keys(queryData).sort();
  const entries: [string, string][] = [];
  for (const key of sortedKeys) {
    const value = queryData[key];
    // SP-API wants one comma-separated value; repeating the key has Amazon
    // read only the last occurrence, silently — see
    // docs/amazon-spapi-api.md#list-valued-query-parameters-are-comma-separated-not-repeated-keys.
    if (Array.isArray(value)) entries.push([key, value.join(",")]);
    else entries.push([key, value]);
  }
  const params = new URL.URLSearchParams(entries);
  return params.toString();
};

export default handleSpapiRequest;
