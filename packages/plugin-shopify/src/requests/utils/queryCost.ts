/**
 * Shopify prices a query from its shape before running it and refuses anything
 * over `MAX_QUERY_COST`, on every plan regardless of remaining budget — which is
 * why every request here declares a cost. The published cost table, the two
 * things it leaves unsettled, and the audited cost of each request are in
 * docs/shopify-api.md#query-cost.
 */

/** An object field — and so also a list field that is not a connection. */
export const OBJECT_COST = 1;

/** Charged on top of the cost of the payload the mutation selects. */
export const MUTATION_COST = 10;

/**
 * The `edges` and `node` wrappers, once per connection however many nodes come
 * back. Inferred from the object rule rather than published.
 */
export const CONNECTION_OVERHEAD = 2;

export const MAX_QUERY_COST = 1000;

export const connectionCost = (pageSize: number, nodeCost: number): number =>
  CONNECTION_OVERHEAD + pageSize * nodeCost;
