import { GetManyResponse, Metafield, MultiRecord } from "../types.js";

export interface GetCompaniesResponse {
  companies: GetManyResponse<Company>;
}

export interface GetCompanyResponse {
  company: Company | null;
}

export interface Company {
  id: string;
  name: string;
  customerInvoiceEmail: Metafield | null;
  locations: MultiRecord<Location>;
  contacts: MultiRecord<CompanyContact>;
}

export interface Location {
  billingAddress: {
    id: string;
    companyName: string;
    recipient: string;
    firstName: string | null;
    lastName: string | null;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    zip: string;
    zoneCode: string;
    country: string;
    countryCode: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
  phone: string | null;
  taxSettings: {
    taxExempt: boolean;
    taxExemptions: unknown[];
    taxRegistrationId: string | null;
  };
  buyerExperienceConfiguration: {
    paymentTermsTemplate: {
      description: string;
      dueInDays: number;
      name: string;
      paymentTermsType: string;
    } | null;
  };
  catalogs: MultiRecord<{
    title: string;
  }>;
}

export interface CompanyContact {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    companyContactProfiles: {
      id: string;
    }[];
  };
}
