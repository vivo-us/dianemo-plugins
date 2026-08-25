import { tryHandleRequest } from "@dianemo/plugin-kit";
import { buildClientName } from "@dianemo/core";

export interface OxrLatestResponse {
  disclaimer: string;
  license: string;
  timestamp: number; // unix seconds
  base: string;
  rates: Record<string, number>;
}

export interface OxrHistoricalResponse extends OxrLatestResponse {}

export interface OxrCallOptions {
  organizationId?: string | null; // `null`/absent selects the global credential
  alias?: string; // defaults to `production`
}

function clientName(opts?: OxrCallOptions): string {
  return buildClientName("openExchangeRates", {
    instanceId: opts?.alias ?? "production",
    organizationId: opts?.organizationId ?? null,
  });
}

/** Free plan is USD-base only. `symbols` is comma-separated, not an array. */
export async function getLatestRates(
  opts?: OxrCallOptions,
  params: { base?: string; symbols?: string } = {}
): Promise<OxrLatestResponse> {
  const res = await tryHandleRequest<OxrLatestResponse>(
    {
      clientName: clientName(opts),
      requestName: "openExchangeRates.latest",
      method: "GET",
      url: "/api/latest.json",
      params,
    },
    "OXR_0001",
    "Failed to fetch OXR latest rates"
  );
  return res.data;
}

/** `date` must be `YYYY-MM-DD`. */
export async function getHistoricalRates(
  opts: OxrCallOptions | undefined,
  date: string,
  params: { base?: string; symbols?: string } = {}
): Promise<OxrHistoricalResponse> {
  const res = await tryHandleRequest<OxrHistoricalResponse>(
    {
      clientName: clientName(opts),
      requestName: "openExchangeRates.historical",
      method: "GET",
      url: `/api/historical/${date}.json`,
      params,
    },
    "OXR_0002",
    `Failed to fetch OXR historical rates for ${date}`
  );
  return res.data;
}
