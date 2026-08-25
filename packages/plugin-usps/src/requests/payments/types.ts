export type UspsPaymentRoleName =
  | "PAYER"
  | "RATE_HOLDER"
  | "LABEL_OWNER"
  | "SHIPPER"
  | "MAIL_OWNER"
  | "PLATFORM"
  | "RETURN_LABEL_PAYER"
  | "RETURN_LABEL_RATE_HOLDER"
  | "RETURN_LABEL_OWNER"
  | "LABEL_PROVIDER";

export type UspsPaymentAccountType = "EPS" | "PERMIT" | "METER" | "OMAS";

export interface UspsPaymentRole {
  roleName: UspsPaymentRoleName;
  CRID?: string;
  MID?: string;
  manifestMID?: string;
  accountType?: UspsPaymentAccountType;
  accountNumber?: string;
  permitNumber?: string;
  permitZIP?: string;
  nonProfitStatus?: boolean;
  sufficientFunds?: boolean;
}

export interface UspsAuthorizePaymentRequest {
  roles: UspsPaymentRole[];
}

export interface UspsAuthorizePaymentResponse {
  paymentAuthorizationToken: string;
  roles: UspsPaymentRole[];
}
