import { TrackPackagesRequest, TrackPackagesResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const trackPackages = async (
  clientName: string,
  data: TrackPackagesRequest
): Promise<TrackPackagesResponse> => {
  const url = "/track/v1/trackingnumbers";
  const res = await tryHandleRequest<TrackPackagesResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.track",
      method: "POST",
      url,
      data,
    },
    "FDX_0006",
    "Failed to track FedEx packages"
  );

  return res.data;
};

export default trackPackages;
