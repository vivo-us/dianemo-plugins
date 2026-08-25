import { tryHandleRequest } from "@dianemo/plugin-kit";
import { neweggSubClient } from "../utils.js";
import {
  GetNeweggReturnsFilters,
  NeweggReturnResponse,
  NeweggReturnsApiVersion,
} from "./types.js";

export const getRmaInfo = async (
  clientName: string,
  filters?: GetNeweggReturnsFilters
) => {
  const apiVersion: NeweggReturnsApiVersion = 320;
  const res = await tryHandleRequest<NeweggReturnResponse>(
    {
      clientName: neweggSubClient(clientName, "getRmaInfo"),
      requestName: "newegg.returns.getRmaInfo",
      method: "PUT",
      url: "/servicemgmt/rma/rmainfo",
      params: { version: apiVersion },
      data: {
        OperationType: "GetRMAInfoRequest",
        RequestBody: { ...filters },
      },
    },
    "NWG_0004",
    "Failed to get Newegg RMA information"
  );
  return res.data;
};
