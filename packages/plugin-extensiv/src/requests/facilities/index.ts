import { tryHandleRequest } from "@dianemo/plugin-kit";
import { ExtensivListOptions } from "../types.js";

export const getFacilities = async (
  clientName: string,
  options?: ExtensivListOptions
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "extensiv.facilities.list",
      method: "GET",
      url: `/properties/facilities`,
      params: options,
    },
    "EXT_0002",
    "Failed to fetch Extensiv facilities"
  );
  return res.data;
};
