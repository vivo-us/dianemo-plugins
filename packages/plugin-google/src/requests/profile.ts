import { tryHandleRequest } from "@dianemo/plugin-kit";
import { GoogleProfileResponse } from "./types.js";
import { googleSubClient } from "./utils.js";

/**
 * The URL is the long-standing `www.googleapis.com/oauth2/v3/userinfo` alias,
 * reached through the account's `baseUrl`. Google documents only
 * `openidconnect.googleapis.com/v1/userinfo` now, and the alias still being
 * served is inferred rather than confirmed —
 * docs/google-api.md#openid-connect-userinfo
 */
export const getGoogleProfile = async (
  clientName: string,
  userId: string
): Promise<GoogleProfileResponse> => {
  const res = await tryHandleRequest<GoogleProfileResponse>(
    {
      clientName: googleSubClient(clientName, "profile"),
      requestName: "google.profile.get",
      grantId: userId,
      method: "GET",
      url: "/oauth2/v3/userinfo",
    },
    "GGL_0008",
    "Failed to fetch Google user profile"
  );
  return res.data;
};
