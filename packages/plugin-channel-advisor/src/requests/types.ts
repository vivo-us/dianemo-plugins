import { DateTime } from "luxon";

export type CAFilterOperator = "eq" | "ne" | "gt" | "ge" | "lt" | "le";

export type CAFilterFunction =
  "year" | "month" | "day" | "hour" | "minute" | "second" | "floor" | "ceiling";

export enum Flag {
  NotSpecified = -9999,
  ItemCopied = -2,
  ExclamationPoint = -1,
  NoFlag = 0,
  RedFlag = 1,
  QuestionMark = 2,
  NotAvailable = 3,
  Price = 4,
  YellowFlag = 5,
  GreenFlag = 6,
  BlueFlag = 7,
}

export interface CAPagingQueryOptions<
  F,
  E extends CAExpand | undefined = undefined,
> extends CAQueryOptions<F, E> {
  exported?: boolean;
  filter?: CAQueryFilterGroup<F>;
  orderBy?: CAOrderBy<F>;
  skip?: number;
  top?: number;
  count?: boolean;
}

export interface CAQueryOptions<F, E extends CAExpand | undefined = undefined> {
  select?: F[];
  expand?: E extends undefined ? never : E;
}

export type CAExpand = {
  options?: string[];
  children?: { [key: string]: CAExpand };
};

export interface CAQueryFilterGroup<F> {
  type: "and" | "or";
  filters: (CAQueryFilter<F> | CAQueryFilterGroup<F>)[];
  childRecordName?: string;
}

export interface CAQueryFilter<F> {
  func?: CAFilterFunction;
  field: F;
  operator: CAFilterOperator;
  value: string | number | null | boolean | DateTime;
}

export interface CAOrderBy<F> {
  field: F;
  direction: "asc" | "desc";
}

export interface CAResultList<T> {
  "@odata.context": string;
  value: T[];
  "@odata.nextLink"?: string;
  "@odata.count"?: number;
}

export type CAResult<T extends object> = T & {
  "@odata.context": string;
};
