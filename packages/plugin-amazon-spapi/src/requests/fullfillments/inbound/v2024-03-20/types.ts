export interface GetInboundPlansResponse {
  inboundPlans: {
    createdAt: string;
    marketplaceIds: string[];
    sourceAddress: {
      phoneNumber: string;
      city: string;
      countryCode: string;
      postalCode: string;
      name: string;
      addressLine1: string;
      stateOrProvinceCode: string;
    };
    lastUpdatedAt: string;
    name: string;
    inboundPlanId: string;
    status: string;
  }[];
  pagination?: {
    nextToken: string;
  };
}

export interface GetInboundPlanResponse {
  createdAt: string;
  marketplaceIds: string[];
  packingOptions: unknown[];
  sourceAddress: {
    phoneNumber: string;
    city: string;
    countryCode: string;
    postalCode: string;
    name: string;
    addressLine1: string;
    stateOrProvinceCode: string;
  };
  lastUpdatedAt: string;
  name: string;
  inboundPlanId: string;
  placementOptions: {
    placementOptionId: string;
    status: string;
  }[];
  shipments: {
    shipmentId: string;
    status: string;
  }[];
  status: string;
}
