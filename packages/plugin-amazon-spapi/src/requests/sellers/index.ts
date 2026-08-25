import { GetSellerMarketplaceParticipationResponse } from "./types.js";
import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";

export const getSellerMarketplaceParticipation = async (
  clientName: string,
  awsRegion: AwsRegion
): Promise<GetSellerMarketplaceParticipationResponse> => {
  const res =
    await handleSpapiRequest<GetSellerMarketplaceParticipationResponse>(
      clientName,
      awsRegion,
      "AMZ_0067",
      "Failed to get Amazon seller marketplace participations",
      {
        endpoint: "sellersGetMarketplaceParticipations",
        url: "/sellers/v1/marketplaceParticipations",
      },
      "amazonSpapi.sellers.getMarketplaceParticipations"
    );
  return res.data;
};
