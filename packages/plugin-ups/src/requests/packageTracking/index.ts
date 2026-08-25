import { tryHandleRequest } from "@dianemo/plugin-kit";
import { TrackPackageResponse } from "./types.js";

/**
 * !IMPORTANT: The date/time returned for each activity instance is in the timezone of the city/state where the activity occurred.
 */

export const trackPackage = async (
  clientName: string,
  trackingNumber: string,
  options?: {
    locale?: string;
    returnSignature?: boolean;
  }
): Promise<TrackPackageResponse> => {
  const url = `/api/track/v1/details/${trackingNumber}?returnSignature=${
    options?.returnSignature ? "true" : "false"
  }&locale=${options?.locale ? options.locale : "en_US"}`;
  const res = await tryHandleRequest<TrackPackageResponse>(
    {
      clientName,
      requestName: "ups.packageTracking.track",
      method: "GET",
      url,
    },
    "UPS_0006",
    "Failed to track UPS package"
  );
  return res.data;
};
