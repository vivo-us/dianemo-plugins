import { CAPagingQueryOptions } from "../../types.js";

export type GetProductChildrenOptions = CAPagingQueryOptions<keyof Child>;

export interface Child {
  ParentProductID: number;
  ProfileID: number;
  ChildProductID: number;
}

export interface RemoveProductChildrenData {
  Value: { ChildProductIDList: number[] };
}
