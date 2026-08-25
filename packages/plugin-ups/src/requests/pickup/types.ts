/**
 * Pickup Rate's `pickuptype` path parameter. `oncall` is a scheduled one-off
 * collection, `smart` a UPS Smart Pickup, and `both` asks for the two side by
 * side — see docs/ups-api.md#pickup-path-segments.
 */
export type UpsPickupType = "oncall" | "smart" | "both";

export interface UpsPickupCreationRequest {
  PickupCreationRequest: {
    RatePickupIndicator: "Y" | "N";
    AlternateAddressIndicator?: "Y" | "N";
    PaymentMethod?: "00" | "01" | "02" | "03"; // 00=No payment, 01=Pay by check
    Shipper: {
      Account: {
        AccountNumber: string;
        AccountCountryCode: string;
      };
    };
    PickupDateInfo: {
      CloseTime: string; // "1600" (HHMM format)
      ReadyTime: string; // "0800" (HHMM format)
      PickupDate: string; // "20260408" (YYYYMMDD format)
    };
    PickupAddress: {
      CompanyName?: string;
      ContactName?: string;
      AddressLine: string[];
      City: string;
      StateProvince?: string;
      PostalCode: string;
      CountryCode: string;
      ResidentialIndicator?: "Y" | "N";
      Phone: { Number: string };
    };
    PickupPiece: {
      ServiceCode: string; // "001" = Next Day Air, "003" = Ground
      Quantity: string;
      DestinationCountryCode: string;
      ContainerCode: string; // "01" = Package, "02" = UPS Letter
    }[];
    TotalWeight?: {
      Weight: string;
      UnitOfMeasurement: { Code: string }; // "LBS" | "KGS"
    };
  };
}

export interface UpsPickupCreationResponse {
  PickupCreationResponse: {
    PRN: string;
    RateStatus?: {
      Code: string;
      Description: string;
    };
    Response: {
      ResponseStatus: {
        Code: string;
        Description: string;
      };
    };
  };
}

export interface UpsPickupCancelResponse {
  PickupCancelResponse: {
    PickupType: string;
    Response: {
      ResponseStatus: {
        Code: string;
        Description: string;
      };
      TransactionReference?: {
        CustomerContext: string;
      };
    };
  };
}

export interface UpsPickupRateRequest {
  PickupRateRequest: {
    AlternateAddressIndicator?: "Y" | "N";
    ServiceDateOption?: "01" | "02" | "03"; // 01=same day, 02=future day, 03=both
    Shipper: {
      Account: {
        AccountNumber: string;
        AccountCountryCode: string;
      };
    };
    PickupDateInfo: {
      PickupDate: string; // "YYYYMMDD"
      ReadyTime: string; // "HHMM"
      CloseTime: string; // "HHMM"
    };
    PickupAddress: {
      CompanyName?: string;
      ContactName?: string;
      AddressLine: string[];
      City: string;
      StateProvince?: string;
      PostalCode: string;
      CountryCode: string;
      ResidentialIndicator?: "Y" | "N";
      Phone: { Number: string };
    };
    PickupPiece: {
      ServiceCode: string;
      Quantity: string;
      DestinationCountryCode: string;
      ContainerCode: string;
    }[];
    TotalWeight?: {
      Weight: string;
      UnitOfMeasurement: { Code: string };
    };
  };
}

export interface UpsPickupRateResponse {
  PickupRateResponse: {
    RateResult: {
      ChargeDetail: {
        ChargeAmount: string;
        ChargeCode: string;
        ChargeDescription: string;
        TaxAmount: string;
      }[];
      CurrencyCode: string;
      GrandTotalOfAllCharge: string;
      RateType: string;
    };
    Response: {
      ResponseStatus: {
        Code: string;
        Description: string;
      };
    };
  };
}
