import { CurrencyCodes } from "@dianemo/plugin-kit";

export type WalmartBoolean = "true" | "false";

export interface WalmartBaseError {
  code: string;
  field?: string;
  description?: string;
  info?: string;
  severity?: "INFO" | "WARN" | "ERROR";
  category?: "APPLICATION" | "SYSTEM" | "REQUEST" | "DATA";
  causes?: WalmartErrorCause[];
  errorIdentifiers?: object;
}

interface WalmartErrorCause {
  code?: string;
  field?: string;
  type?: string;
  description?: string;
}

export interface WalmartError extends WalmartBaseError {
  component?: string;
  type?: string;
  serviceName?: string;
  gatewayErrorCategory?:
    "INTERNAL_DATA_ERROR" | "EXTERNAL_DATA_ERROR" | "SYSTEM_ERROR";
}

export interface WalmartPrice {
  currency: CurrencyCodes;
  amount: number;
}
