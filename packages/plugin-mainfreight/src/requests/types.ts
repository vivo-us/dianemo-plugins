/**
 * `EUROPE` is the Netherlands and Belgium only and `ASIA` is Hong Kong, Japan
 * and China only — full table: docs/mainfreight-api.md#regions
 *
 * No `CANADA` member: Mainfreight groups Canada under `US`, so `UNITED_STATES`
 * is what a Canadian site passes. `CANADA = "US"` would be indistinguishable
 * from `UNITED_STATES` at runtime *and* in the type system, making one branch of
 * a `switch` dead code and collapsing a `Record<MainfreightRegion, T>` into one
 * entry.
 */
export enum MainfreightRegion {
  NEW_ZEALAND = "NZ",
  AUSTRALIA = "AU",
  UNITED_STATES = "US",
  UNITED_KINGDOM = "UK",
  EUROPE = "EU",
  ASIA = "AS",
}

export type MainfreightServiceType =
  | "TransportNZ"
  | "TransportAU"
  | "TransportUS"
  | "TransportEU"
  | "WarehousingAU"
  | "WarehousingNZ"
  | "WarehousingUS"
  | "WarehousingUK"
  | "WarehousingEU"
  | "ContainersNZ"
  | "ContainersAU"
  | "AirAndOcean";

/**
 * Mainfreight constrains which of these each service type accepts, and that
 * relationship is not modelled here — the union is flat, so an invalid pairing
 * is caught by the API rather than the compiler. Per-service-type list:
 * docs/mainfreight-api.md#reference-types-by-service-type
 */
export type MainfreightReferenceType =
  | "ContainerNumber"
  | "ContainerJobNumber"
  | "HousebillNumber"
  | "BarcodeNumber"
  | "CustomerReference"
  | "ShipmentNumber"
  | "InboundReference"
  | "OutboundReference"
  | "Reference"
  | "JobNumber"
  | "MasterbillNumber"
  | "OrderNumber"
  | "OrderReference"
  | "ConsignmentNumber";

export interface MainfreightCode<T extends string | number> {
  code: T;
}

export interface MainfreightWarehouseCode extends MainfreightCode<number> {}

/** Assigned by Mainfreight, which scopes orders and inventory by it. */
export interface MainfreightCustomerCode extends MainfreightCode<string> {}

export interface MainfreightBaseOrder {
  carrierReference?: string;
  warehouse: MainfreightWarehouseCode;
  customer: MainfreightCustomerCode;
  pallets?: number;
  weight?: number;
  volume?: number;
}

export interface MainfreightBaseOrderLine<
  Product = MainfreightOrderLineProduct,
> {
  lineNo: number;
  units: number;
  product: Product;
  weight?: number;
  volume?: number;
  grade1?: string;
  grade2?: string;
  grade3?: string;
  expiryDate?: Date;
  packingDate?: Date;
  packType?: string;
  underBond?: number;
  kitsetCode?: string;
}

export interface MainfreightOrderLineProduct {
  description?: string;
  alternativeDescription?: string;
  /** Your own SKU, as registered with Mainfreight. */
  code: string;
}

export interface MainfreightExternalReference {
  externalSystem: {
    code: string;
    references: {
      reference: {
        referenceType: string;
        value: string;
      };
    }[];
  };
}

export interface MainfreightAddress extends MainfreightCode<string> {
  name?: string;
  address1: string;
  address2?: string;
  /** AKA city */
  place?: string;
  state?: string;
  postCode?: string;
  code: string; // alphanumeric code to represent the customer who submitted the order
  country: string;
  suburb?: string;
  phone?: string;
}
