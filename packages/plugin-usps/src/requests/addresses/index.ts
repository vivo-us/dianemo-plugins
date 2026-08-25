import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsValidateAddressParams,
  UspsAddressResponse,
} from "./types.js";

export const validateAddress = async (
  clientName: string,
  params: UspsValidateAddressParams
): Promise<UspsAddressResponse> => {
  const res = await tryHandleRequest<UspsAddressResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.addresses.validate",
      method: "GET",
      url: "/addresses/v3/address",
      params,
    },
    "USP_0004",
    "Failed to validate USPS address"
  );
  return res.data;
};
