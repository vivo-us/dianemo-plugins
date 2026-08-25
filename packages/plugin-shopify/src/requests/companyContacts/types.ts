export interface ShopifyCompanyContactDetails {
  id: string;
  company: {
    id: string;
    locations: {
      edges: [
        {
          node: {
            id: string;
          };
        },
      ];
    };
  };
}

export interface ShopifyCompanyContactResponse {
  companyContact: ShopifyCompanyContactDetails;
}
