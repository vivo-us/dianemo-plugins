import { Method } from "axios";

export interface GetLWATokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RestrictedResource {
  method: Method;
  path: string;
  dataElements: DataElement[];
}

type DataElement = "buyerInfo" | "shippingAddress" | "buyerTaxInformation";

export interface GetRDTResponse {
  restrictedDataToken: string;
  expiresIn: number;
}
