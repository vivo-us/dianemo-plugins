import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  BaseCredentialsData,
  CreateClientData,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    smarty: SmartyCredentials;
  }
}

export interface SmartyCredentials extends BaseCredentialsData {
  /**
   * Rides in the query string, where core's redaction does not reach it, so any
   * 4xx/5xx logs it in plaintext. Not fixable from here: Smarty's secret-key
   * auth is query-string only, and core's escape hatch covers headers.
   * `authToken` is redacted; this one is not.
   */
  authId: string;
  authToken: string;
}

const US_BASE_URL = "https://us-street.api.smarty.com";
const INTL_BASE_URL = "https://international-street.api.smarty.com";

/**
 * One secret-key pair covers both the US Street and International Street APIs,
 * billed per lookup against a single subscription. Each surface is a sub-client
 * so retry, freeze and metrics are scoped per endpoint, but the rate limit is
 * the parent's and is shared across the two — measured, and the reason two
 * independent buckets are wrong: docs/smarty-api.md#the-rate-limit-budget-is-shared-across-both-surfaces
 */
export async function registerSmartyTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "smarty",
    (creds): CreateClientData[] => {
      const parentName = buildClientName("smarty", creds);

      return [
        {
          name: parentName,
          // This repo's own ceiling, not a Smarty figure: they publish 25,000/s
          // for US and 3,500/s for international, so 1,000/s clears the tighter
          // of the two by 3.5x even if every call goes there. One bucket for both
          // surfaces protects the single lookup quota they bill against, not a
          // shared rate ceiling —
          // docs/smarty-api.md#the-published-rate-limits-are-per-surface-and-are-enormous
          rateLimit: {
            type: "requestLimit",
            interval: 1_000,
            tokensToAdd: 1_000,
            maxTokens: 1_000,
          },
          requestOptions: {
            // Parent URL is informational only — every request goes through a
            // sub-client. Default to US for any direct parent call.
            defaults: { baseURL: US_BASE_URL },
          },
          subClients: [
            {
              name: "us",
              rateLimit: { type: "sharedLimit", clientName: parentName },
              requestOptions: {
                defaults: { baseURL: US_BASE_URL },
                requestInterceptor: (config) => ({
                  ...config,
                  params: {
                    "auth-id": creds.authId,
                    "auth-token": creds.authToken,
                    ...(config.params ?? {}),
                  },
                }),
              },
            },
            {
              name: "intl",
              rateLimit: { type: "sharedLimit", clientName: parentName },
              requestOptions: {
                defaults: { baseURL: INTL_BASE_URL },
                requestInterceptor: (config) => ({
                  ...config,
                  params: {
                    "auth-id": creds.authId,
                    "auth-token": creds.authToken,
                    ...(config.params ?? {}),
                  },
                }),
              },
            },
          ],
        },
      ];
    }
  );
}
