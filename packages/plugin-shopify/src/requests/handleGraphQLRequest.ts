import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import { GraphQLResponse } from "./types.js";

/**
 * Callers pass the account name from `buildClientName("shopify", creds)`, which
 * holds the credentials but has no `baseURL` and no budget — passing it straight
 * through is what made every documented call fail with `Invalid URL`. An
 * already-appended name is left alone, so a name from
 * `handler.getTemplateClientNames` works too.
 */
const graphQLClientName = (clientName: string) =>
  clientName.endsWith(":graph-ql") ? clientName : `${clientName}:graph-ql`;

const handleGraphQLRequest = async <T>(
  clientName: string,
  code: string,
  message: string,
  cost: number,
  requestName: string,
  query: string,
  variables?: object
): Promise<GraphQLResponse<T>> => {
  const res = await tryHandleRequest<GraphQLResponse<T>>(
    {
      clientName: graphQLClientName(clientName),
      requestName,
      data: { query, variables: variables || {} },
      method: "POST",
      cost,
    },
    code,
    message
  );
  if (!res.data.errors?.length) return res.data;
  // Throttling never arrives here: the transport turns it into a retryable 429
  // (../throttling.ts), so core has already retried and given up. What is left is
  // a query or permission problem no retry fixes, and Shopify's own error codes
  // are carried through because `MAX_COST_EXCEEDED` and `ACCESS_DENIED` want very
  // different responses from the caller.
  throw new RequestError(code, message, {
    metadata: {
      errors: res.data.errors,
      context: res.data.errors
        .map((error) =>
          error.extensions?.code
            ? `${error.extensions.code}: ${error.message}`
            : error.message
        )
        .join("; "),
    },
  });
};

export default handleGraphQLRequest;
