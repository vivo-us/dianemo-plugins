import { WayfairGraphQLData, WayfairGraphQLResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";

/**
 * Sends one GraphQL query and refuses a response carrying `errors`, or a missing
 * `data` with no `errors` — neither is a result, and Wayfair returns both under
 * HTTP 200, so nothing in the transport layer sees the failure. See
 * docs/wayfair-api.md#a-rejected-query-comes-back-as-http-200.
 */
const handleGraphQLRequest = async <T>(
  clientName: string,
  requestName: string,
  code: string,
  message: string,
  query: string
): Promise<WayfairGraphQLData<T>> => {
  const res = await tryHandleRequest<WayfairGraphQLResponse<T>>(
    {
      clientName,
      requestName,
      method: "POST",
      data: { query },
    },
    code,
    message
  );
  const { data, errors } = res.data;
  if (errors?.length || !data) {
    throw new RequestError(code, message, {
      metadata: {
        context:
          errors?.map((e) => e.message).join("; ") ||
          "Wayfair returned neither data nor errors",
        errors,
      },
    });
  }
  return { ...res.data, data };
};

export default handleGraphQLRequest;
