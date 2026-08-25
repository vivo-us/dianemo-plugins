import { tryHandleRequest } from "@dianemo/plugin-kit";
import { googleSubClient } from "./utils.js";
import {
  GoogleAddressValidationRequest,
  GoogleValidationResponse,
} from "./types.js";

/**
 * `grantId` names the OAuth grant to authenticate as. An account registered with
 * an `apiKey` carries its credential in the query string and leaves it unset.
 */
export interface ValidateAddressOptions {
  grantId?: string;
}

export const validateAddress = async (
  clientName: string,
  data: GoogleAddressValidationRequest,
  { grantId }: ValidateAddressOptions = {}
): Promise<GoogleValidationResponse> => {
  const res = await tryHandleRequest<GoogleValidationResponse>(
    {
      clientName: googleSubClient(clientName, "addressValidation"),
      requestName: "google.addressValidation.validate",
      grantId,
      method: "POST",
      url: "/v1:validateAddress",
      data,
    },
    "GGL_0003",
    "Failed to validate address via Google Address Validation API"
  );
  return res.data;
};
