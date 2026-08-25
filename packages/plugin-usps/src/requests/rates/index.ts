import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsTotalRatesQuery,
  UspsTotalRatesResult,
  UspsBaseRatesListQuery,
  UspsBaseRatesListResult,
} from "./types.js";

export const getTotalRates = async (
  clientName: string,
  data: UspsTotalRatesQuery
): Promise<UspsTotalRatesResult> => {
  const res = await tryHandleRequest<UspsTotalRatesResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.totalSearch",
      method: "POST",
      url: "/prices/v3/total-rates/search",
      data,
    },
    "USP_0002",
    "Failed to get USPS domestic rates"
  );
  return res.data;
};

export const getBaseRatesList = async (
  clientName: string,
  data: UspsBaseRatesListQuery
): Promise<UspsBaseRatesListResult> => {
  const res = await tryHandleRequest<UspsBaseRatesListResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.baseListSearch",
      method: "POST",
      url: "/prices/v3/base-rates-list/search",
      data,
    },
    "USP_0009",
    "Failed to get USPS base rates list"
  );
  return res.data;
};
