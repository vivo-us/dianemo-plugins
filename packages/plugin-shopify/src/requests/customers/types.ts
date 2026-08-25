import { GetManyResponse } from "../types.js";

export interface GetOneCustomerResponse {
  customer: Customer | null;
}

export interface GetManyCustomersResponse {
  customers: GetManyResponse<Customer>;
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  tags: string[];
  companyContactProfiles: CompanyContactProfile[];
  defaultEmailAddress: {
    emailAddress: string | null;
  } | null;
  addresses: CustomerAddress[];
}

export interface CustomerAddress {
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
}

export interface CompanyContactProfile {
  id: string;
  title: string | null;
  company: {
    id: string;
    name: string;
  };
}
