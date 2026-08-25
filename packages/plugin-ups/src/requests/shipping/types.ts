import { CurrencyCodes } from "@dianemo/plugin-kit";
import { DCISType } from "../rating/types.js";
import { Indicator } from "../types.js";

export interface VoidUpsShipmentResponse {
  VoidShipmentResponse: {
    Response: {
      ResponseStatus: {
        Code: string;
        Description: string;
      };
      Alert?: {
        Code: string;
        Description: string;
      };
      TransactionReference?: {
        CustomerContext?: string;
      };
    };
    SummaryResult: {
      Status: {
        Code: string;
        Description: string;
      };
    };
    PackageLevelResult?: {
      TrackingNumber: string;
      Status: {
        Code: string;
        Description: string;
      };
    }[];
  };
}

/**
 * Neither this nor `UpsBillableWeightCalculationMethod` is returned unless
 * `RatingMethodRequestedIndicator` is present in the request, so absence means
 * "you did not ask" rather than shipment level. Both were declared inside out
 * until 1.0.0 and no comparison against them could ever be true — see
 * docs/ups-api.md#rating-and-billable-weight-enums-were-inverted
 */
export enum UpsRatingMethod {
  ShipmentLevel = "01",
  PackageLevel = "02",
}

export enum UpsBillableWeightCalculationMethod {
  ShipmentBillableWeight = "01",
  PackageBillableWeight = "02",
}

export interface UpsShipmentRequest {
  ShipmentRequest: {
    Request: {
      RequestOption: string;
      SubVersion?: string;
      TransactionReference?: {
        CustomerContext: string;
      };
    };
    Shipment: {
      TaxInformationIndicator?: Indicator;
      ShipmentRatingOptions?: {
        NegotiatedRatesIndicator?: Indicator;
      };
      Description?: string;
      Shipper: UpsShipper;
      ShipTo: UpsShipTo;
      ShipFrom?: UpsShipFrom;
      PaymentInformation?: UpsPaymentInformation;
      Service: {
        Code: string;
        Description?: string;
      };
      Package: UpsPackage[];
      InvoiceLineTotal?: {
        CurrencyCode: CurrencyCodes;
        MonetaryValue: string;
      };
      ReturnService?: {
        Code: string; // "8" = Electronic Return Label, "9" = Print Return Label
        Description?: string;
      };
      ShipmentServiceOptions?: {
        InternationalForms?: UpsInternationalForm;
        SaturdayDeliveryIndicator?: Indicator;
        DeliveryConfirmation?: {
          DCISType: DCISType;
        };
      };
    };
    LabelSpecification: {
      LabelImageFormat: {
        Code: string;
      };
      LabelStockSize: {
        Height: string;
        Width: string;
      };
    };
  };
}

export interface UpsInternationalForm {
  FormType: string;
  TermsOfShipment?: string;
  Product: {
    Description: string;
    Unit: {
      Number: string;
      UnitOfMeasurement: {
        Code: string;
        Description?: string;
      };
      Value: string;
    };
    ProductWeight?: {
      UnitOfMeasurement: { Code: string };
      Weight: string;
    };
    PartNumber: string;
    OriginCountryCode: string;
  }[];
  InvoiceDate: string;
  ReasonForExport: string;
  CurrencyCode: CurrencyCodes;
  Contacts: {
    SoldTo: {
      Name: string;
      AttentionName: string;
      Address: {
        AddressLine: string[];
        City: string;
        StateProvinceCode?: string;
        PostalCode: string;
        CountryCode: string;
      };
    };
  };
}

export interface UpsShipper {
  Name: string;
  Description?: string;
  ShipperNumber: string;
  Address: UpsAddress;
  AttentionName?: string;
  Phone?: {
    Number: string;
  };
}

export interface UpsPackage {
  Description?: string;
  Packaging: {
    Code: string;
    Description?: string;
  };
  Dimensions: UpsDimensions;
  PackageWeight: UpsWeight;
  PackageServiceOptions?: {
    DeliveryConfirmation?: {
      DCISType: DCISType;
    };
  };
  ReferenceNumber?: {
    Value: string;
    Code: string;
  }[];
}

export interface UpsPaymentInformation {
  ShipmentCharge: {
    Type: "01" | "02" | "03";
    BillReceiver?: {
      AccountNumber: string;
      Address?: {
        PostalCode: string;
      };
    };
    BillShipper?: {
      AccountNumber: string;
      Address?: UpsAddress;
      AlternatePaymentMethod?: string;
    };
    BillThirdParty?: {
      AccountNumber: string;
      CertifiedElectronicMail?: string;
      InterchangeSystemCode?: string;
      Address: {
        PostalCode?: string;
        CountryCode: string;
      };
    };
  }[];
}

export interface UpsShipTo {
  Name: string;
  Phone?: {
    Number: string;
  };
  Address: UpsAddress;
  Residential?: string;
  AttentionName?: string;
}

export interface UpsShipFrom {
  Name: string;
  AttentionName?: string;
  Phone?: {
    Number: string;
  };
  Address: UpsAddress;
}

export interface UpsAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode: string;
  CountryCode: string;
  ResidentialAddressIndicator?: Indicator;
}

export interface UpsShipmentResponse {
  ShipmentResponse: {
    Response: {
      ResponseStatus: UpsAlert;
      Alert?: UpsAlert[];
      TransactionReference?: {
        CustomerContext?: string;
      };
    };
    ShipmentResults: UpsShipmentResult[];
  };
}

export interface UpsShipmentResult {
  Disclaimer?: UpsAlert;
  ShipmentCharges?: {
    RateChart?: string;
    BaseServiceCharge?: UpsCurrency;
    TransportationCharges: UpsCurrency;
    ItemizedCharges?: UpsItemizedCharge[];
    ServiceOptionsCharges: UpsCurrency;
    TaxCharges?: UpsTaxCharge[];
    TotalCharges: UpsCurrency;
    TotalChargesWithTaxes?: UpsCurrency;
  };
  NegotiatedRateCharges?: {
    ItemizedCharges?: UpsItemizedCharge[];
    TaxCharges?: UpsTaxCharge[];
    TotalCharge?: UpsCurrency;
    TotalChargesWithTaxes?: UpsCurrency;
  };
  FRSShipmentData?: {
    TransportationCharges: {
      GrossCharge: UpsCurrency;
      DiscountAmount: UpsCurrency;
      DiscountPercentage: string;
      NetCharge: UpsCurrency;
    };
    FreightDensityRate?: {
      Density: string;
      TotalCubicFeet: string;
    };
    HandlingUnits: {
      Quantity: string;
      Type: UpsCode;
      Dimensions: UpsDimensions;
      AdjustedHeight?: string;
    }[];
  };
  RatingMethod?: UpsRatingMethod;
  BillableWeightCalculationMethod?: UpsBillableWeightCalculationMethod;
  BillingWeight: UpsWeight;
  ShipmentIdentificationNumber?: string;
  MIDualReturnShipmentKey?: string;
  BarCodeImage?: string;
  PackageResults?: UpsPackageResult[];
  ControlLogReceipt?: UpsImage[];
  Form?: UpsForm;
  CODTurnInPage?: {
    Image: UpsImage;
  };
  HighValueReport?: {
    Image: UpsImage;
  };
  LabelURL?: string;
  LocalLanguageLabelURL?: string;
  ReceiptURL?: string;
  LocalLanguageReceiptURL?: string;
  DGPaperImage?: string[];
  MasterCartonID?: string;
  RoarRatedIndicator?: string;
}

export interface UpsAlert {
  Code: string;
  Description: string;
}
export interface UpsCode {
  Code: string;
  Description?: string;
}

export interface UpsCurrency {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}
export interface UpsItemizedCharge extends UpsCurrency {
  Code?: string;
  Description: string;
  subType?: string;
}

export interface UpsTaxCharge {
  Type: string;
  MonetaryValue: string;
}

export interface UpsDimensions {
  UnitOfMeasurement: UpsCode;
  Length: string;
  Width: string;
  Height: string;
}

export interface UpsWeight {
  UnitOfMeasurement: UpsCode;
  Weight: string;
}

export interface UpsPackageResult {
  TrackingNumber: string;
  RateModifier?: {
    ModifierType: string;
    ModifierDesc: string;
    Amount: string;
  };
  BaseServiceCharge?: UpsCurrency;
  ServiceOptionsCharges?: UpsCurrency;
  ShippingLabel?: UpsShippingLabel;
  ShippingReceipt?: UpsImage;
  USPSPICNumber?: string;
  CN22Number?: string;
  Accessorial?: UpsCode;
  SimpleRate?: { Code: string };
  Form?: UpsForm;
  ItemizedCharges?: UpsItemizedCharge[];
  NegotiatedCharges?: {
    ItemizedCharges?: UpsItemizedCharge[];
  };
}

export interface UpsImage {
  ImageFormat: UpsCode;
  GraphicImage: string;
}

export interface UpsShippingLabel extends UpsImage {
  GraphicImagePart?: string[];
  InternationalSignatureGraphicImage?: string;
  HTMLImage?: string;
  PDF417?: string;
}

export interface UpsForm extends UpsAlert {
  Image?: UpsImage;
  FormGroupId?: string;
  FormGroupIdName?: string;
}
