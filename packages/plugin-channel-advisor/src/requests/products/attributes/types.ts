import { CAPagingQueryOptions, CAQueryOptions } from "../../types.js";

export type GetProductAttributesOptions = CAPagingQueryOptions<keyof Attribute>;

export type GetProductAttributeOptions = CAQueryOptions<keyof Attribute>;

export interface CreateUpdateProductAttributesData {
  Value: {
    Attributes: {
      Name: string;
      Value: string;
    }[];
  };
}

export interface Attribute {
  ProductID: number;
  ProfileID: number;
  Name: string;
  Value: string;
}
