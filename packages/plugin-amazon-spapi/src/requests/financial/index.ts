import { GetFinancialEventsByOrderResponse } from "./types.js";
import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";

export const getFinancialEventsByOrder = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string
): Promise<GetFinancialEventsByOrderResponse> => {
  const res = await handleSpapiRequest<GetFinancialEventsByOrderResponse>(
    clientName,
    awsRegion,
    "AMZ_0058",
    "Failed to get financial events for Amazon order",
    {
      endpoint: "financesListFinancialEventsByOrderId",
      url: `/finances/v0/orders/${orderId}/financialEvents`,
    },
    "amazonSpapi.finances.listFinancialEventsByOrderId"
  );
  return res.data;
};
