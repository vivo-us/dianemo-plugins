import { GetManyResponse } from "../types.js";

export interface GetOneCompanyLocationResponse {
  companyLocation: CompanyLocation | null;
}

export interface GetManyCompanyLocationsResponse {
  companyLocations: GetManyResponse<CompanyLocation>;
}

export interface CompanyLocation {
  id: string;
  company: {
    id: string;
  };
  taxSettings: {
    taxExempt: boolean;
  };
  buyerExperienceConfiguration: {
    paymentTermsTemplate: {
      id: string;
      translatedName: string;
      name: string;
      paymentTermsType: string;
    };
  };
}
