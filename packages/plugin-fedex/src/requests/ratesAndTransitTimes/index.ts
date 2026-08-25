import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  GetRatesAndTransitTimesData,
  GetRatesAndTransitTimesResponse,
} from "./types.js";

export const getFedexRatesAndTransitTimes = async (
  clientName: string,
  data: GetRatesAndTransitTimesData
): Promise<GetRatesAndTransitTimesResponse> => {
  const url = "/rate/v1/rates/quotes";
  const res = await tryHandleRequest<GetRatesAndTransitTimesResponse>(
    {
      clientName,
      requestName: "fedex.rates.getQuotes",
      method: "POST",
      url,
      data: data.body,
    },
    "FDX_0002",
    "Failed to get FedEx rates and transit times"
  );
  return res.data;
};
