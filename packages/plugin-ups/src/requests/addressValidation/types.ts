export interface XAVResponse {
  XAVResponse: UPSValidationResponse;
}
export interface UPSValidationResponse {
  Response: {
    ResponseStatus: {
      Code: string;
      Description: string;
    };
    TransactionReference: {
      CustomerContext: string;
      TransactionIdentifier: string;
    };
  };
  /** Address is valid */
  ValidAddressIndicator?: string;
  /** Address was not valid and no possible candidates were found */
  NoCandidatesIndicator?: string;
  /** Address was not valid but possible candidates were found */
  AmbiguousAddressIndicator?: string;
  AddressClassification?: {
    /** 0=Unclassified; 1=Commerical; 2=Residential */
    Code: "0" | "1" | "2";
    Description: "Commercial" | "Residential" | "Unknown";
  };
  Candidate?: AddressCandidate | AddressCandidate[];
}

export interface AddressCandidate {
  AddressClassification?: {
    /** 0=Unclassified; 1=Commerical; 2=Residential */
    Code: "0" | "1" | "2";
    Description: "Commercial" | "Residential" | "Unknown";
  };
  AddressKeyFormat: {
    /** Only addressLine 1 returned */
    AddressLine: string | string[];
    Region?: string;
    /** City */
    PoliticalDivision2: string;
    /** State */
    PoliticalDivision1: string;
    /** Normal Postal Code */
    PostcodePrimaryLow: string;
    /** US 10-digit Postal Code */
    PostcodeExtendedLow: string;
    /** Puerto Rico; Only Returned for PR */
    Urbanization?: string;
    /** Country Code */
    CountryCode: string;
  };
}

export interface XAVRequest {
  XAVRequest: {
    AddressKeyFormat: {
      ConsigneeName?: string;
      AttentionName?: string;
      AddressLine: string[];
      PoliticalDivision2: string;
      PoliticalDivision1?: string;
      PostcodePrimaryLow: string;
      PostcodeExtendedLow?: string;
      CountryCode: string;
    };
  };
}
