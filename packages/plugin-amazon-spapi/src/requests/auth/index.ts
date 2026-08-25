import { OAuthGrantTypeResponse } from "@dianemo/core/client/types";
import { GetRDTResponse, RestrictedResource } from "./types.js";
import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import url from "node:url";

export const getRdt = async (
  clientName: string,
  awsRegion: AwsRegion,
  restrictedResources: RestrictedResource[]
): Promise<GetRDTResponse> => {
  const res = await handleSpapiRequest<GetRDTResponse>(
    clientName,
    awsRegion,
    "AMZ_0025",
    "Failed to create restricted data token for Amazon SP-API",
    {
      endpoint: "tokensCreateRestrictedDataToken",
      url: "/tokens/2021-03-01/restrictedDataToken",
      data: { restrictedResources },
    },
    "amazonSpapi.tokens.createRestrictedDataToken"
  );
  return res.data;
};

export interface GetRefreshTokenParams {
  code: string;
  apiUrl: string;
  redirectUrl: string;
  clientId: string;
  clientSecret: string;
}

export const getRefreshToken = async ({
  code,
  apiUrl,
  redirectUrl,
  clientId,
  clientSecret,
}: GetRefreshTokenParams): Promise<OAuthGrantTypeResponse> => {
  const res = await tryHandleRequest<OAuthGrantTypeResponse>(
    {
      clientName: "default",
      requestName: "amazonSpapi.auth.getRefreshToken",
      method: "POST",
      url: `${apiUrl}/auth/o2/token`,
      data: new url.URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: redirectUrl,
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }).toString(),
    },
    "AMZ_0026",
    "Failed to exchange authorization code for Amazon refresh token"
  );
  return res.data;
};
