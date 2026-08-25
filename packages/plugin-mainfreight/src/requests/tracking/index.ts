import { tryHandleRequest } from "@dianemo/plugin-kit";
import { TrackServiceResponse } from "./types.js";
import { resolveRegion } from "../utils.js";
import {
  MainfreightReferenceType,
  MainfreightRegion,
  MainfreightServiceType,
} from "../types.js";

export const trackService = async (
  clientName: string,
  serviceType: MainfreightServiceType,
  region: MainfreightRegion,
  reference: string,
  referenceType?: MainfreightReferenceType
): Promise<TrackServiceResponse[]> => {
  const resolvedRegion = resolveRegion(region);
  const res = await tryHandleRequest<TrackServiceResponse[]>(
    {
      clientName,
      requestName: "mainfreight.tracking.get",
      method: "GET",
      url: `/Tracking/1.1/References?serviceType=${serviceType}&reference=${reference}&region=${resolvedRegion}${
        referenceType ? `&referenceType=${referenceType}` : ""
      }`,
    },
    "MFT_0001",
    "Failed to track Mainfreight service"
  );
  return res.data;
};
