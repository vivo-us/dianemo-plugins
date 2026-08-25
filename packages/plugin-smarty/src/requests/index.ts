import { tryHandleRequest } from "@dianemo/plugin-kit";
import { buildClientName } from "@dianemo/core";
import type {
  SmartyIntlCandidate,
  SmartyIntlRequest,
  SmartyUsCandidate,
  SmartyUsRequest,
} from "./types.js";

export interface SmartyCallOptions {
  /** Organization scope — must match the `organizationId` the
   * Smarty credentials were registered under. */
  organizationId: string | null;
  /** Per-environment integration alias, e.g. `production` or `sandbox`. */
  alias?: string;
}

function smartyClient(opts: SmartyCallOptions, sub: "us" | "intl"): string {
  const alias = opts.alias ?? "production";
  return `${buildClientName("smarty", {
    organizationId: opts.organizationId,
    instanceId: alias,
  })}:${sub}`;
}

/**
 * Defaults to one strict candidate. `body` is spread last, so a caller can
 * override either — `match: "enhanced"` adds Smarty's non-USPS dataset to the
 * USPS results, and is billed as a separate lookup type.
 */
export const verifySmartyUs = async (
  body: SmartyUsRequest,
  options: SmartyCallOptions
): Promise<SmartyUsCandidate[]> => {
  const res = await tryHandleRequest<SmartyUsCandidate[]>(
    {
      clientName: smartyClient(options, "us"),
      requestName: "smarty.us.verify",
      method: "POST",
      url: "/street-address",
      data: [
        {
          candidates: 1,
          match: "strict",
          ...body,
        },
      ],
    },
    "SMT_0001",
    "Smarty US verification failed"
  );
  return res.data ?? [];
};

/** The international endpoint is GET-only, and takes one address per request. */
export const verifySmartyIntl = async (
  params: SmartyIntlRequest,
  options: SmartyCallOptions
): Promise<SmartyIntlCandidate[]> => {
  // Strip undefined keys before serialization — axios will otherwise emit
  // them as bare query keys.
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") cleaned[k] = String(v);
  }

  const res = await tryHandleRequest<SmartyIntlCandidate[]>(
    {
      clientName: smartyClient(options, "intl"),
      requestName: "smarty.intl.verify",
      method: "GET",
      url: "/verify",
      params: cleaned,
    },
    "SMT_0002",
    "Smarty International verification failed"
  );
  return res.data ?? [];
};
