import { OAuthResponse } from "@dianemo/core/client/types";

export interface GoogleAddressValidationRequest {
  address: {
    addressLines: string[];
    locality: string;
    administrativeArea?: string;
    postalCode: string;
    regionCode: string;
  };
}

export interface GoogleValidationResponse {
  result: {
    verdict: {
      inputGranularity: string;
      validationGranularity: string;
      geocodeGranularity: string;
      hasUnconfirmedComponents?: boolean;
      addressComplete?: boolean;
      hasInferredComponents?: boolean;
    };
    address: {
      formattedAddress: string;
      postalAddress: {
        addressLines: string[];
        locality: string;
        administrativeArea: string;
        postalCode: string;
        regionCode: string;
      };
      addressComponents: AddressComponent[];
      unconfirmedComponentTypes?: string[];
      missingComponentTypes?: string[];
    };
    geocode: {
      location: { latitude: number; longitude: number };
      plusCode: { globalCode: string };
      bounds: {
        low: { latitude: number; longitude: number };
        high: { latitude: number; longitude: number };
      };
      placeId: string;
      placeTypes: string[];
    };
    metadata?: { business: boolean; poBox: boolean; residential: boolean };
    uspsData?: UspsData;
  };
}

interface UspsData {
  standardizedAddress: {
    firstAddressLine: string;
    cityStateZipAddressLine: string;
    city: string;
    state: string;
    zipCode: string;
    zipCodeExtension: string;
  };
  deliveryPointCode: string;
  deliveryPointCheckDigit: string;
  dpvConfirmation: string;
  dpvFootnote: string;
  dpvCmra: string;
  dpvVacant: string;
  dpvNoStat: string;
  carrierRoute: string;
  carrierRouteIndicator: string;
  postOfficeCity: string;
  postOfficeState: string;
  fipsCountyCode: string;
  county: string;
  elotNumber: string;
  elotFlag: string;
  addressRecordType: string;
}

interface AddressComponent {
  componentName: { text: string; languageCode?: string };
  componentType: string;
  confirmationLevel: string;
}

/**
 * The OpenID Connect userinfo response. Only `sub` is guaranteed: every other
 * claim depends on the scopes granted, and Google warns that a user or their
 * organization may withhold one even then. `sub` is a string because it is a
 * 21-digit decimal, past what a JS number holds exactly.
 *
 * Which claim needs which scope, and the Google+ era fields this used to
 * declare: docs/google-api.md#openid-connect-userinfo
 */
export interface GoogleProfileResponse {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string;
}

export interface GoogleOAuthResponse extends OAuthResponse {
  id_token: string;
}
