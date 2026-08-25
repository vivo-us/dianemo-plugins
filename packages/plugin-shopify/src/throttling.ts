import { GraphQLResponse } from "./requests/types.js";

const THROTTLED_CODE = "THROTTLED";

/**
 * Shopify answers a throttled query with **HTTP 200** and a body-level
 * `THROTTLED` error. Core classifies retries from `error.response.status`, so a
 * 200 resolved rather than rejected and the retry-and-freeze path was never
 * reached: the caller got a body with no `data` and no second attempt.
 *
 * Shaped by hand rather than with `new AxiosError(...)` because axios is core's
 * dependency, not this package's — importing it here would resolve only by
 * hoisting. Core reads `response.status`, `code`, `message`, `stack` and `config`
 * off a failure, and its sanitiser tolerates the missing `config`.
 */
class ShopifyThrottledError extends Error {
  readonly isAxiosError = true;
  readonly code = "SHOPIFY_THROTTLED";
  readonly response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: unknown;
  };

  constructor(body: unknown) {
    super(
      "Shopify throttled the GraphQL request: the query cost exceeded the " +
        "points currently available in the shop's bucket"
    );
    this.name = "ShopifyThrottledError";
    // 429 is the status core already treats as rate-limited: back off this
    // attempt and freeze the client fleet-wide, rather than retrying blind.
    this.response = {
      status: 429,
      statusText: "Too Many Requests",
      headers: {},
      data: body,
    };
  }
}

/**
 * Returns the raw text when it is not JSON rather than throwing, so a proxy's
 * HTML error page surfaces as its own status code and not as a parse failure.
 */
const parseBody = (data: unknown): unknown => {
  if (typeof data !== "string" || !data.length) return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const isThrottled = (body: unknown): boolean => {
  const errors = (body as GraphQLResponse<unknown> | null | undefined)?.errors;
  if (!Array.isArray(errors)) return false;
  return errors.some((error) => error.extensions?.code === THROTTLED_CODE);
};

/**
 * `transformResponse` is the only seam that sees both the parsed body and the
 * transport: `responseInterceptor` runs after the response has been recorded as a
 * success and its throws are logged and swallowed, and `validateStatus` never
 * sees the body. What this throws lands in core's `handleError` exactly as a real
 * 429 would. Setting it also replaces axios's own JSON parsing, hence `parseBody`.
 *
 * Only a 200 is inspected: error responses run through this transform too (axios
 * transforms `reason.response.data` on the rejection path), and throwing there
 * would replace the upstream's own failure with this one.
 */
export const throttleAwareTransformResponse = (
  data: unknown,
  _headers: unknown,
  status?: number
): unknown => {
  const body = parseBody(data);
  if (status === 200 && isThrottled(body))
    throw new ShopifyThrottledError(body);
  return body;
};
