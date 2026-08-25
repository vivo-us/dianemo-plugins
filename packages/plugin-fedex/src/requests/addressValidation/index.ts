import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExValidateAddressRequest,
  FedExValidateAddressResponse,
} from "./types.js";

export const validateFedExAddress = async (
  clientName: string,
  data: FedExValidateAddressRequest
): Promise<FedExValidateAddressResponse> => {
  const url = "/address/v1/addresses/resolve";
  const res = await tryHandleRequest<FedExValidateAddressResponse>(
    {
      clientName,
      requestName: "fedex.addressValidation.resolve",
      method: "POST",
      url,
      data,
    },
    "FDX_0004",
    "Failed to validate FedEx address"
  );
  return res.data;
};
