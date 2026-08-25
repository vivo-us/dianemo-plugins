import { CAPagingQueryOptions, CAQueryOptions } from "../../types.js";

export type GetAllProductBundleComponentsOptions = CAPagingQueryOptions<
  keyof BundleComponent
>;

export type GetProductBundeComponentsOptions = CAQueryOptions<
  keyof BundleComponent
>;

export interface UpdateComponentQuantityOnProductBundleData {
  productId: number;
  componentId: number;
  quantity: number;
}

export interface BundleComponent {
  ProductID: number;
  ProfileID: number;
  ComponentID: number;
  ComponentSku: string;
  Quantity: number;
}
