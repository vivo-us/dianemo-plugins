/** Wayfair sends the spec's shape; `message` is the only field it always fills in. */
export interface WayfairGraphQLError {
  message: string;
  path?: (string | number)[];
  locations?: { line: number; column: number }[];
  extensions?: Record<string, unknown>;
}

/**
 * A GraphQL envelope as it arrives on the wire. `data` is nullable because
 * Wayfair answers a rejected query with HTTP 200 and `{"data":null,"errors":[…]}`
 * — see docs/wayfair-api.md#a-rejected-query-comes-back-as-http-200.
 */
export interface WayfairGraphQLResponse<T> {
  data: T | null;
  errors?: WayfairGraphQLError[];
}

export type WayfairGraphQLData<T> = WayfairGraphQLResponse<T> & { data: T };
