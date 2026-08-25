import { OAuthGrantTypeResponse } from "@dianemo/core/client/types";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { grantIdOf } from "../clientName.js";
import { RequestError } from "@dianemo/core";
import { Identity } from "./types.js";

export interface GetGrantTokenParams {
  code: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  /**
   * The callback URL registered with the provider. Deployment-specific, so the
   * caller supplies it — it must byte-match what is configured on the provider
   * side or the exchange is rejected.
   */
  redirectUri: string;
}

export const getGrantToken = async ({
  code,
  baseUrl,
  clientId,
  clientSecret,
  redirectUri,
}: GetGrantTokenParams): Promise<OAuthGrantTypeResponse> => {
  const params = new URLSearchParams({
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await tryHandleRequest<OAuthGrantTypeResponse>(
    {
      clientName: "default",
      requestName: "channelAdvisor.auth.getGrantToken",
      method: "POST",
      baseURL: baseUrl,
      url: "/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      data: params.toString(),
    },
    "CHA_0001",
    "Failed to obtain Channel Advisor OAuth grant token"
  );
  return res.data;
};

/**
 * Two callers: an established account, which passes `clientName` and lets the
 * registered client supply the token; and onboarding, which has just exchanged
 * an auth code, has no client and so no grant to authenticate as, and passes the
 * raw `accessToken` instead. `clientName` stays in first position either way —
 * it is where every other request function in the catalogue takes it, and a
 * plugin whose one exception sits somewhere else is a plugin whose callers guess.
 */
export const getIdentity = async (
  clientName: string | undefined,
  baseUrl: string,
  accessToken?: string
) => {
  if (!accessToken && !clientName) {
    throw new RequestError(
      "CHA_0002",
      'getIdentity needs either the clientName of a registered account, e.g. buildClientName("channelAdvisor", creds), or an accessToken (during onboarding, before the account has a client).'
    );
  }
  const res = await tryHandleRequest<Identity>(
    {
      clientName: accessToken ? "default" : clientName!,
      requestName: "channelAdvisor.auth.getIdentity",
      method: "GET",
      baseURL: baseUrl,
      url: "/oauth2/identity",
      ...(accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : { grantId: grantIdOf(clientName!) }),
    },
    "CHA_0003",
    "Failed to retrieve Channel Advisor identity"
  );
  const identity = res.data;
  const profiles = identity
    .filter((i) => i.Type === "urn:ca:claim:profile")
    .map((i) => i.Value);
  const name = identity.find((i) => {
    return (
      i.Type === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    );
  });
  const scopes = identity
    .filter((i) => i.Type === "urn:ca:claim:scope")
    .map((i) => i.Value);
  if (!scopes.length || !name || !profiles.length) {
    throw new RequestError(
      "CHA_0004",
      "Channel Advisor identity response missing required fields (scopes, name, or profiles)",
      {
        metadata: { identity },
      }
    );
  }
  return { name: name.Value, profiles, scopes };
};
