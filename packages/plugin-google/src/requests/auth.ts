import { tryHandleRequest } from "@dianemo/plugin-kit";
import { GoogleOAuthResponse } from "./types.js";

export interface ExchangeAuthCodeForRefreshTokenParams {
  code: string;
  clientId: string;
  clientSecret: string;
  /**
   * Deployment-specific, so the caller supplies it: it must byte-match what is
   * registered on the provider side or Google rejects the exchange.
   */
  redirectUri: string;
}

export const exchangeAuthCodeForRefreshToken = async ({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: ExchangeAuthCodeForRefreshTokenParams): Promise<GoogleOAuthResponse> => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  const res = await tryHandleRequest<GoogleOAuthResponse>(
    {
      clientName: "default",
      requestName: "google.auth.exchangeAuthCode",
      method: "POST",
      baseURL: "https://oauth2.googleapis.com",
      url: "/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: params.toString(),
    },
    "GGL_0007",
    "Failed to exchange Google authorization code for refresh token"
  );
  return res.data;
};
