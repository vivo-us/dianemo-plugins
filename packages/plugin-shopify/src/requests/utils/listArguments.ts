/**
 * Variables rather than interpolation into the query text, which was broken two
 * ways at once: `JSON.stringify` quotes every value and a quoted string is not a
 * GraphQL enum, so every documented `sortKey`, `format` and `topics` value was a
 * parser error; and a search `query` containing a `"` closed the string literal
 * early, handing the caller the rest of the document. Variables travel as JSON
 * beside the document, so the server coerces enums itself and nothing a caller
 * sends is ever parsed as GraphQL.
 */

/** GraphQL type per option name, e.g. `{ first: "Int", sortKey: "OrderSortKeys" }`. */
export type ListArgumentTypes = Record<string, string>;

export interface ListArguments {
  declarations: string;
  arguments: string;
  variables: Record<string, unknown>;
}

/**
 * Shopify names a separate `sortKey` enum per connection (`OrderSortKeys`,
 * `CustomerSortKeys`, …) and rejects the wrong one outright, so each caller
 * names its own.
 */
export const basicListArgumentTypes = (
  sortKeyType: string
): ListArgumentTypes => ({
  after: "String",
  before: "String",
  first: "Int",
  last: "Int",
  query: "String",
  reverse: "Boolean",
  sortKey: sortKeyType,
});

export const buildListArguments = (
  options: Record<string, unknown>,
  types: ListArgumentTypes
): ListArguments => {
  const entries = Object.entries(options).filter(
    ([, value]) => value !== undefined
  );
  const unknown = entries.find(([key]) => !(key in types));
  if (unknown) {
    // Dropping it would silently ignore a filter the caller believes is
    // applied. TypeScript already forbids this, so reaching here means an
    // untyped call site.
    throw new Error(
      `Unknown Shopify list option "${unknown[0]}". Supported options: ${Object.keys(
        types
      )
        .sort()
        .join(", ")}.`
    );
  }
  if (!entries.length)
    return { declarations: "", arguments: "", variables: {} };
  return {
    declarations: `(${entries
      .map(([key]) => `$${key}: ${types[key]}`)
      .join(", ")})`,
    arguments: `(${entries.map(([key]) => `${key}: $${key}`).join(", ")})`,
    variables: Object.fromEntries(entries),
  };
};

/** Shopify accepts exactly one of `first`/`last`, and it prices the connection. */
export const listPageSize = (options: {
  first?: number;
  last?: number;
}): number => options.first ?? options.last ?? 0;
