import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { UspsTrackingDetails } from "./types.js";
import { uspsSubClient } from "../utils.js";

export const trackPackage = async (
  clientName: string,
  trackingNumber: string
): Promise<UspsTrackingDetails> => {
  const res = await tryHandleRequest<UspsTrackingDetails>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.tracking.get",
      method: "GET",
      url: `/tracking/v3/tracking/${trackingNumber}`,
      params: { expand: "DETAIL" },
    },
    "USP_0005",
    "Failed to track USPS package"
  );
  return res.data;
};
