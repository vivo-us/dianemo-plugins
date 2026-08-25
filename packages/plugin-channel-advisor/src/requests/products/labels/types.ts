import { CAPagingQueryOptions, CAQueryOptions } from "../../types.js";

export type GetProductLabelsOptions = CAPagingQueryOptions<keyof Label>;

export type GetProductLabelOptions = CAQueryOptions<keyof Label>;

export interface Label {
  ProductID: number;
  ProfileID: number;
  Name: string;
}
