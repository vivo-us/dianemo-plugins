import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import {
  UspsAuthorizePaymentRequest,
  UspsAuthorizePaymentResponse,
} from "./types.js";

export const authorizePayment = async (
  clientName: string,
  data: UspsAuthorizePaymentRequest
): Promise<UspsAuthorizePaymentResponse> => {
  const res = await tryHandleRequest<UspsAuthorizePaymentResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.payments.authorize",
      method: "POST",
      url: "/payments/v3/payment-authorization",
      data,
    },
    "USP_0050",
    "Failed to authorize USPS payment"
  );
  return res.data;
};
