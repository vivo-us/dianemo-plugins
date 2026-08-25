import { CurrencyCodes } from "@dianemo/plugin-kit";
import {
  FedExAlert,
  FedExPackageType,
  FedExResponse,
  FedExServiceType,
} from "../types.js";

export interface FedexShippingRequest {
  mergeLabelDocOption?: "NONE" | "LABELS_AND_DOCS" | "LABELS_ONLY";
  requestedShipment: {
    shipper: FedExAddress;
    origin?: FedExAddress;
    recipients: FedExAddress[];
    pickupType:
      | "CONTACT_FEDEX_TO_SCHEDULE"
      | "DROPOFF_AT_FEDEX_LOCATION"
      | "USE_SCHEDULED_PICKUP";
    serviceType: FedExServiceType;
    packagingType: FedExPackageType;
    shippingChargesPayment: {
      paymentType: "SENDER" | "RECIPIENT" | "THIRD_PARTY";
      payor?: {
        responsibleParty: {
          accountNumber: { value: string };
        };
      };
    };
    labelSpecification: {
      labelStockType: string;
      imageType: string;
      labelPrintingOrientation?: string;
    };
    totalPackageCount: number;
    requestedPackageLineItems: FedExPackage[];
    rateRequestTypes?: string[];
    preferredCurrency?: CurrencyCodes;
    customsClearanceDetail?: CustomsClearanceDetail;
    shippingDocumentSpecification?: {
      shippingDocumentTypes?: (
        | "CERTIFICATE_OF_ORIGIN"
        | "COMMERCIAL_INVOICE"
        | "CUSTOM_PACKAGE_DOCUMENT"
        | "CUSTOM_SHIPMENT_DOCUMENT"
        | "CUSTOMER_SPECIFIED_LABELS"
        | "EXPORT_DECLARATION"
        | "GENERAL_AGENCY_AGREEMENT"
        | "LABEL"
        | "USMCA_CERTIFICATION_OF_ORIGIN"
        | "OP_900"
        | "PENDING_SHIPMENT_EMAIL_NOTIFICATION"
        | "PRO_FORMA_INVOICE"
        | "RETURN_INSTRUCTIONS"
        | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
      )[];
      commercialInvoiceDetail?: {
        customerImageUsages?: {
          id?: ("IMAGE_1" | "IMAGE_2" | "IMAGE_3" | "IMAGE_4" | "IMAGE_5")[];
          type?: "LETTER_HEAD" | "SIGNATURE";
          providedImageType?: "LETTER_HEAD" | "SIGNATURE";
        }[];
        documentFormat?: {
          provideInstructions?: boolean;
          optionsRequested?: {
            options?: (
              | "SHIPPING_LABEL_FIRST"
              | "SHIPPING_LABEL_LAST"
              | "SUPPRESS_ADDITIONAL_LANGUAGES"
            )[];
          };
          stockType: "PAPER_LETTER";
          dispositions?: {
            eMailDetail?: {
              eMailRecipients: {
                emailAddress?: string;
                recipientType:
                  | "BROKER"
                  | "OTHER"
                  | "RECIPIENT"
                  | "SHIPPER"
                  | "THIRD_PARTY"
                  | "OTHER1"
                  | "OTHER2";
              }[];
              locale?: string;
              grouping?: "BY_RECIPIENT" | "NONE";
            };
            dispositionType?:
              | "CONFIRMED"
              | "DEFERRED_QUEUED"
              | "DEFERRED_RETURNED"
              | "DEFERRED_STORED"
              | "EMAILED"
              | "QUEUED"
              | "RETURNED"
              | "STORED";
          }[];
          locale?: string;
          docType: "PDF";
        };
      };
    };
  };
  labelResponseOptions: "URL_ONLY" | "LABEL";
  accountNumber: {
    value: string;
  };
  shipmentSpecialServices?: {
    specialServiceTypes: ("RETURN_SHIPMENT" | "SATURDAY_DELIVERY")[];
    returnShipmentDetail?: {
      returnEmailDetail: {
        merchantPhoneNumber: string;
      };
      rma: {
        reason: string;
      };
      returnAssociationDetail: {
        shipDatestamp: string;
        trackingNumber: string;
      };
      returnType: "PRINT_RETURN_LABEL";
    };
  };
}

export interface FedExAddress {
  address: {
    streetLines: string[];
    city: string;
    stateOrProvinceCode?: string;
    postalCode: string;
    countryCode: string;
    residential: boolean;
  };
  contact: {
    personName?: string;
    companyName?: string;
    phoneNumber: string;
  };
}

export interface FedExPackage {
  sequenceNumber?: number;
  weight: {
    units: string;
    value: number;
  };
  dimensions?: {
    units: string;
    length: number;
    width: number;
    height: number;
  };
  customerReferences?: CustomerReference[];
  packageSpecialServices?: PackageSpecialServicesDetail;
}

export interface CustomsClearanceDetail {
  commercialInvoice: {
    originatorName: string;
    termsOfSale?: string;
    shipmentPurpose?: string;
  };
  commodities: CustomsClearanceDetailCommodity[];
  dutiesPayment: {
    paymentType: string;
    payor?: {
      responsibleParty: {
        accountNumber: { value: string };
      };
    };
  };
  totalCustomsValue: {
    amount: number;
    currency: CurrencyCodes;
  };
}

export interface CustomsClearanceDetailCommodity {
  description: string;
  harmonizedCode?: string;
  weight: {
    value: number;
    units: string;
  };
  customsValue: {
    amount: number;
    currency: CurrencyCodes;
  };
  countryOfManufacture: string;
  quantity: number;
  quantityUnits: string;
  unitPrice: {
    amount: number;
    currency: CurrencyCodes;
  };
}

// `…Detail`, not `PackageSpecialServices`: the rate catalogue's runtime
// `PackageSpecialService` enum reaches the same barrel, and a one-character
// difference between an interface and an enum is not one an import picks up on.
export interface PackageSpecialServicesDetail {
  specialServiceTypes: string[];
  signatureOptionType: string;
}

export interface CustomerReference {
  customerReferenceType: string;
  value: string;
}

export type FedexShippingResponse = FedExResponse<FedexShippingOutput>;

interface FedexShippingOutput {
  transactionShipments: TransactionShipments[];
}

export interface TransactionShipments {
  serviceType: FedExServiceType;
  shipDatestamp: string;
  serviceCategory: string;
  shipmentDocuments: ShipmentDocument[];
  pieceResponses: PieceResponse[];
  serviceName: string;
  alerts: FedExAlert[];
  completedShipmentDetail: FedExCompleteShipmentDetail;
  shipmentAdvisoryDetails: object;
  masterTrackingNumber: string;
}

export interface PieceResponse {
  masterTrackingNumber: string;
  deliveryDatestamp: string;
  trackingNumber: string;
  additionalChargesDiscount: number;
  netRateAmount: number;
  netChargeAmount: number;
  netDiscountAmount: number;
  packageDocuments: PackageDocument[];
  currency: string;
  customerReferences: [];
  codcollectionAmount: number;
  baseRateAmount: number;
}

export interface PackageDocument {
  contentType: string;
  copiesToPrint: number;
  encodedLabel: string;
  docType: string;
}

export interface ShipmentDocument {
  contentKey: string;
  copiesToPrint: number;
  contentType: string;
  trackingNumber: string;
  docType: string;
  alerts: FedExAlert[];
  encodedLabel: string;
  url: string;
}

/** Partially modelled — FedEx returns more fields than are typed here. */
export interface FedExCompleteShipmentDetail {
  completedPackageDetails: CompletedPackageDetail[];
  operationalDetail: {
    originServiceArea: string;
    serviceCode: string;
    airportId: string;
    postalCode: string;
    scac: string;
    deliverDay: string;
    originLocationId: string;
    countryCode: string;
    astraDescription: string;
    originLocationNumber: string;
    deliveryDate: string;
    deliveryEligibilities: string[];
    ineligibleForMoneyBackGuarantee: boolean;
    maximumTransitTime: string;
    destinationLocationStateOrProvinceCode: string;
    astraPlannedServiceLevel: string;
    destinationLocationId: string;
    transitTime: string;
    stateOrProvinceCode: string;
    destinationLocationNumber: number;
    commitDate: string;
    publishedDeliveryTime: string;
    ursaSuffixCode: string;
    ursaPrefixCode: string;
    destinationServiceArea: string;
    commitDay: string;
    customTransitTime: string;
  };
  carrierCode: string;
  shipmentRating?: {
    actualRateType: string;
    shipmentRateDetails: {
      rateZone: string;
      ratedWeightMethod: string;
      totalDutiesTaxesAndFees: number;
      pricingCode: string;
      totalFreightDiscounts: number;
      totalTaxes: number;
      totalDutiesAndTaxes: number;
      totalAncillaryFeesAndTaxes: number;
      taxes: {
        amount: number;
        level: string;
        description: string;
        type: string;
      }[];
      totalRebates: number;
      fuelSurchargePercent: number;
      currencyExchangeRate: {
        rate: number;
        fromCurrency: string;
        intoCurrency: string;
      };
      totalNetFreight: number;
      /** Untyped: FedEx's shape for this varies by rate request. */
      shipmentLetRateDetails: object[];
      dimDivisor: number;
      rateType: string;
      surcharges: {
        amount: number;
        surchargeType: string;
        level: string;
        description: string;
      }[];
      totalSurcharges: number;
      totalBillingWeight: {
        units: string;
        value: number;
      };
      freightDiscounts: {
        amount: number;
        rateDiscountType: string;
        description: string;
        percent: number;
      }[];
      rateScale: string;
      totalNetCharge: number;
      totalBaseCharge: number;
      totalNetChargeWithDutiesAndTaxes: number;
      currency: string;
    }[];
  };
}

export interface CompletedPackageDetail {
  sequenceNumber: number;
  operationalDetail: {
    astraHandlingText: string;
    barcodes: {
      binaryBarcodes: {
        type: string;
        value: string;
      }[];
      stringBarcodes: {
        type: string;
        value: string;
      }[];
    };
    operationalInstructions: {
      number: number;
      content: string;
    }[];
  };
  signatureOption: string;
  trackingIds: {
    formId: string;
    trackingIdType: string;
    uspsApplicationid: string;
    trackingNumber: string;
  }[];
  groupNumber: number;
  oversizeClass: string;
  packageRating?: {
    effectiveNetDiscount: number;
    actualRateType: string;
    packageRateDetails: {
      ratedWeightMethod: string;
      totalFreightDiscounts: number;
      totalTaxes: number;
      minimumChargeType: string;
      baseCharge: number;
      totalRebates: number;
      rateType: string;
      billingWeight: {
        units: string;
        value: number;
      };
      netFreight: number;
      surcharges: {
        amount: number;
        surchargeType: string;
        level: string;
        description: string;
      }[];
      totalSurcharges: number;
      netFedExCharge: number;
      netCharge: number;
      currency: string;
    }[];
    dryIceWeight: {
      units: string;
      value: number;
    };
    /** Untyped: populated only for hazardous-materials shipments. */
    hazardousPackageDetail: object;
  };
}
