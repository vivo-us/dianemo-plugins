import { RateResponse, RateOptions, GetPackageRating } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const getUpsRate = async (
  clientName: string,
  data: GetPackageRating,
  options: RateOptions = {
    version: "v2409",
  }
): Promise<RateResponse> => {
  const service = data.RateRequest?.Shipment?.Service?.Code;
  const timeInfo = data.RateRequest.Shipment.DeliveryTimeInformation;
  const version = options.version || "v2409";
  const url = `/api/rating/${version}/${service ? "Rate" : "Shop"}${
    timeInfo ? "?additionalinfo=timeintransit" : ""
  }`;
  const res = await tryHandleRequest<{ RateResponse: RateResponse }>(
    {
      clientName,
      requestName: "ups.rating.getRate",
      method: "POST",
      url,
      data,
    },
    "UPS_0002",
    "Failed to get UPS shipping rate"
  );
  return res?.data.RateResponse;
};
