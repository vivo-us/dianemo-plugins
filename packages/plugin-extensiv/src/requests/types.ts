/**
 * Query parameters every Extensiv collection endpoint accepts. Extensiv pages
 * every collection whether or not the caller asks, and nothing in the body says
 * a page was truncated — compare `TotalResults` against what you received. See
 * docs/extensiv-api.md#pagination.
 */
export interface ExtensivListOptions {
  pgsiz?: number;
  /** Page to return, 1-based. */
  pgnum?: number;
  /** RQL filter expression, e.g. `readonly.customerIdentifier.id==12`. */
  rql?: string;
  /** Sort expression; prefix a field with `-` to sort descending. */
  sort?: string;
}

export interface ExtensivAddress {
  CompanyName?: string;
  Name?: string;
  Address1: string;
  Address2?: string;
  City: string;
  State: string;
  Zip: string;
  Country: string;
}
export interface ExtensivRecordList<T> {
  ResourceList: T[];
  TotalResults: number;
  _links: Record<string, Record<"href", string>>;
}

export interface ExtensivNamedId {
  Id: number;
  Name: string;
}

export interface ExtensivNamedValue {
  Name: string;
  Value: string;
}

export interface ExtensivItemId {
  Id: number;
  Sku: string;
}

export interface ExtensivDimensions {
  Length: number;
  Width: number;
  Height: number;
}

export interface ExtensivWeightedDimensions extends ExtensivDimensions {
  Weight: number;
}
