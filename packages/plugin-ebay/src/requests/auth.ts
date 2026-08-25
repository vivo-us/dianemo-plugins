import { OAuthGrantTypeResponse } from "@dianemo/core/client/types";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export interface ExchangeAuthCodeForAccessTokenParams {
  /** The single-use `?code=` eBay appends when redirecting to `redirectUri`. */
  code: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  /** The RuName registered for the application, not a bare URL. */
  redirectUri: string;
}

/**
 * Exchanges an authorization code for a seller's user token, whose refresh token
 * seeds a grant via `handler.setGrantTokens`.
 *
 * There is deliberately no `scope` parameter: adding one back would read as the
 * thing that narrows the token while changing nothing, since the granted scopes
 * are fixed by the consent request the seller already approved. See
 * docs/ebay-api.md#the-authorization-code-exchange-takes-no-scope.
 */
export const exchangeAuthCodeForAccessToken = async ({
  code,
  baseUrl,
  clientId,
  clientSecret,
  redirectUri,
}: ExchangeAuthCodeForAccessTokenParams): Promise<OAuthGrantTypeResponse> => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });
  const res = await tryHandleRequest<OAuthGrantTypeResponse>(
    {
      clientName: "default",
      requestName: "ebay.auth.exchangeAuthCode",
      method: "POST",
      url: "/identity/v1/oauth2/token",
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      data: params.toString(),
    },
    "EBY_0000",
    "Failed to exchange eBay authorization code for access token"
  );
  return res.data;
};
