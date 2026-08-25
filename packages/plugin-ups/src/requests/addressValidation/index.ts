import { tryHandleRequest } from "@dianemo/plugin-kit";
import { XAVRequest, XAVResponse } from "./types.js";

/** Not a dated version, unlike the rest of UPS — see docs/ups-api.md#version-pins */
const XAV_VERSION = "v2";

/**
 * Validation *and* classification in one call: the candidate list plus whether
 * the address is residential or commercial. `1` is validation only, `2`
 * classification only.
 */
const XAV_REQUEST_OPTION = "3";

/** A narrowing, not the default (15) — see docs/ups-api.md#address-validation-query-parameters */
const XAV_MAX_CANDIDATES = 10;

export const makeUpsAddressValidationRequest = async (
  clientName: string,
  data: XAVRequest
): Promise<XAVResponse> => {
  // docs/ups-api.md#address-validation-query-parameters
  const url = `/api/addressvalidation/${XAV_VERSION}/${XAV_REQUEST_OPTION}?maximumcandidatelistsize=${XAV_MAX_CANDIDATES}`;
  const res = await tryHandleRequest<XAVResponse>(
    {
      clientName,
      requestName: "ups.addressValidation.validate",
      method: "POST",
      url,
      data,
    },
    "UPS_0004",
    "Failed to validate UPS address"
  );
  return res.data;
};
