export interface GetSellerMarketplaceParticipationResponse {
  payload?: MarketplaceParticipation[];
  errors?: {
    code: string;
    message: string;
    details?: string;
  }[];
}

export interface MarketplaceParticipation {
  marketplace: {
    id: string;
    name: string;
    countryCode: string;
    defaultCurrencyCode: string;
    defaultLanguageCode: string;
    domainName: string;
  };
  participation: {
    isParticipating: boolean;
    hasSuspendedListings: boolean;
  };
}
