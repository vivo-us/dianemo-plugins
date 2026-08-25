import { MainfreightRegion } from "./types.js";
import { RequestError } from "@dianemo/core";

const REGIONS = new Set<string>(Object.values(MainfreightRegion));

/**
 * Mainfreight carries `region` in the query string of every endpoint and fails
 * the request outright when it is missing; an unrecognised one comes back as an
 * opaque failure naming nothing, so catch it here before a rate-limit token is
 * spent on it. Case is normalised rather than rejected — the codes are uppercase
 * on the wire and `"nz"` is not ambiguous.
 *
 * docs/mainfreight-api.md#regions
 */
export function resolveRegion(region: MainfreightRegion): MainfreightRegion {
  const code = String(region).toUpperCase();
  if (!REGIONS.has(code)) {
    throw new RequestError("MFT_0009", "Unknown Mainfreight region", {
      metadata: {
        context: `Received "${region}". Expected one of ${[...REGIONS].join(", ")}. Canadian sites use ${MainfreightRegion.UNITED_STATES}.`,
      },
    });
  }
  return code as MainfreightRegion;
}
