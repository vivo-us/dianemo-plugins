import { CAPagingQueryOptions, CAQueryOptions } from "../../types.js";

export type GetOrderCustomFieldsOptions = CAPagingQueryOptions<
  keyof CustomField
>;

export type GetOrderCustomFieldOptions = CAQueryOptions<keyof CustomField>;

export interface CustomField {
  FieldID: number;
  OrderID: number;
  ProfileID: number;
  Value: string;
}
