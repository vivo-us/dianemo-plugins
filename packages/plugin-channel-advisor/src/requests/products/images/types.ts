import { CAPagingQueryOptions, CAQueryOptions } from "../../types.js";

export type GetAllProductImagesOptions = CAPagingQueryOptions<keyof Image>;

export type GetProductImageOptions = CAQueryOptions<keyof Image>;

export interface Image {
  ProductID: number;
  ProfileID: number;
  PlacementName: string;
  Abbreviation: string;
  Url: string;
}
