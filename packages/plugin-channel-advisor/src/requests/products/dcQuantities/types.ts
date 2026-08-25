import { CAPagingQueryOptions } from "../../types.js";

export type QuantiyUpdateType =
  | "Absolute"
  | "Relative"
  | "Available"
  | "InStock"
  | "UnShipped"
  | "Unconfirmed";

export type GetProductDcQuantitiesOptions = CAPagingQueryOptions<
  keyof DCQuantity
>;

export interface UpdateProductDcQuantitiesData {
  UpdateType: QuantiyUpdateType;
  Updates: {
    DistributionCenterID: number;
    Quantity: number;
  }[];
}

export interface DCQuantity {
  ProductID: number;
  ProfileID: number;
  DistributionCenterID: number;
  AvailableQuantity: number;
}
