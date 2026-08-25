import { FedExResponse } from "../types.js";

export interface FedExValidateAddressRequest {
  /** Format yyyy-mm-dd */
  inEffectAsOfTimestamp?: string;
  validateAddressControlParameters?: {
    includeResolutionTokens?: boolean;
  };
  addressesToValidate: FedExValidateAddressAddress[];
}

interface FedExValidateAddressAddress {
  address: {
    streetLines: string[];
    city?: string;
    stateOrProvinceCode?: string;
    postalCode?: string;
    countryCode: string;
  };
  contact?: {
    personName: string;
    phoneNumber: string;
    parsedPersonName?: {
      firstName: string;
      lastName: string;
      middleName?: string;
      suffix?: string;
    };
    companyName?: string;
    phoneExtension?: string;
    emailAddress?: string;
    faxNumber?: string;
    contactId?: string;
    stateTaxId?: string;
    fedralTaxId?: string;
  };
  contactAncillaryDetail?: {
    emailAddresses?: {
      emailNotificationFormatType?: "SMS_TEXT_MESSAGE" | "HTML" | "TEXT";
      address?: string;
      permissions?: "GRANT" | "DENY";
    }[];
    socialMediaDeails?: {
      attributes?: string;
      platformId?: string;
    }[];
    gender?: "MALE" | "FEMALE" | "UNKNOWN";
    prefix?: string;
    phoneNumberDetails: {
      number: {
        areaCode: string;
        extension?: string;
        countryCode: string;
        personalIdentificationNumber: string;
        localNumber: string;
      };
      permissions: "GRANT" | "DENY";
      usage: "PRIMARY" | "SECONDARY";
      type?: "FAX" | "MOBILE" | "PAGER" | "HOME" | "WORK";
      phoneNotificationFormatType?: "SMS_TEXT_MESSAGE";
    }[];
    companyName?: {
      division?: string;
      companyCd?: string;
      name: string;
      department?: string;
      storeId?: string;
    };
    title?: string;
  };
  addressAncillaryDetail?: {
    locationInCity?: string;
    suite?: string;
    addressVerificationOverrideReason?: string;
    locationInProperty?: string;
    addtionalDescriptions?: string;
    department?: string;
    roomFloor?: string;
    crossStreet?: string;
    building?: string;
    apartment?: string;
    room?: string;
  };
  clientReferenceId?: string;
  urbanizationCode?: string;
}

export type FedExValidateAddressResponse =
  FedExResponse<FedExValidateAddressOutput>;

export interface FedExValidateAddressOutput {
  resolvedAddresses: FedExResolvedAddress[];
}

export interface FedExResolvedAddress {
  streetLinesToken?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  countryCode?: string;
  customerMessage?: string[];
  cityToken?: {
    changed?: boolean;
    value?: string;
  }[];
  /** 1st most reliable  postal code for validation*/
  postalCode?: string;
  /** 2nd most reliable  postal code for validation*/
  parsedPostalCode?: {
    base?: string;
    addOn?: string;
    deliveryPoint?: string;
  };
  /**3rd most reliable  postal code for validation*/
  postalCodeToken?: {
    changed?: boolean;
    value?: string;
  };
  classification?: "MIXED" | "UNKNOWN" | "RESIDENTIAL" | "BUSINESS";
  postOfficeBox?: string;
  normalizedStatusNameDPV?: boolean;
  standardizedStatusNameMatchSource?: string;
  resolutionMethodName?:
    | "USPS_VALIDATE"
    | "CA_VALIDATE"
    | "GENERIC_VALIDATE"
    | "NAVTEQ_GEO_VALIDATE"
    | "TELEATLAS_GEO_VALIDATE";
  ruralRouteHighwayContract?: boolean;
  generalDelivery?: boolean;
  attributes?: {
    POBox?: BooleanString;
    POBoxOnlyZIP?: BooleanString;
    SplitZip?: BooleanString;
    SuiteRequiredButMissing?: BooleanString;
    InvalidSuiteNumber?: BooleanString;
    ResolutionInput?: string;
    DPV?: BooleanString;
    ResolutionMethod?: string;
    DataVintage?: string;
    MatchSource?: string;
    CountrySupported?: BooleanString;
    ValidlyFormed?: BooleanString;
    Matched?: string;
    /* `Resolved` is documented but does not appear on responses; do not rely on it. */
    Resolved?: BooleanString;
    Inserted?: BooleanString;
    MultiUnitBase?: BooleanString;
    ZIP11Match?: BooleanString;
    ZIP4Match?: BooleanString;
    UniqueZIP?: BooleanString;
    StreetAddress?: BooleanString;
    RRConversion?: BooleanString;
    ValidMultiUnit?: BooleanString;
    AddressType?: "RAW" | "NORMALIZED" | "STANDARDIZED";
    AddressPrecision?:
      | "MULTI_TENANT_UNIT"
      | "MULTI_TENANT_BASE"
      | "PO_BOX"
      | "UNIQUE_ZIP"
      | "STREET_ADDRESS"
      | "MULTI_TENANT_UNIT";
    MultipleMatches?: BooleanString;
  };
}

export type BooleanString = "true" | "false";
