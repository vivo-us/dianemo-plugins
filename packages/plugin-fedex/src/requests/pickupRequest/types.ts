import {
  FedExDimensions,
  FedExPackageType,
  FedExResponse,
  FedExWeight,
  FedexCarrierCodes,
} from "../types.js";

export interface CheckPickupAvailabilityData {
  pickupAddress: {
    streetLines?: string[];
    urbanizationCode?: string;
    city?: string;
    stateOrProvinceCode?: string;
    postalCode: string;
    countryCode: string;
    residential?: boolean;
    addressClassification?: "MIXED" | "UNKNOWN" | "RESIDENTIAL" | "BUSINESS";
  };
  dispatchDate?: string;
  packageReadyTime?: string;
  customerCloseTime?: string;
  pickupType?: "ON_CALL" | "TAG";
  pickupRequestType: ("SAME_DAY" | "FUTURE_DAY")[];
  numberOfBusinessDays?: number;
  associatedAccountNumber?: "FEDEX_EXPRESS" | "FEDEX_GROUND";
  carriers: FedexCarrierCodes[];
  countryRelationship: "DOMESTIC" | "INTERNATIONAL";
  packageDetails?: {
    packageSpecialServices: {
      specialServiceTypes: string[];
    };
  }[];
  shipmentAttributes?: {
    serviceType?: string;
    weight?: FedExWeight;
    packagingType?: FedExPackageType;
    dimensions?: FedExDimensions;
  };
}

export type CheckPickupAvailabilityResponse =
  FedExResponse<CheckPickupAvailabilityOutput>;

interface CheckPickupAvailabilityOutput {
  requestTimestamp: string;
  options: {
    carrier: FedexCarrierCodes;
    available: boolean;
    pickupDate: string;
    cutOffTime: string;
    accessTime: {
      hours: number;
      minutes: number;
    };
    residentialAvailable: boolean;
    countryRelationship: "DOMESTIC" | "INTERNATIONAL";
    scheduleDay: "SAME_DAY" | "FUTURE_DAY";
    defaultReadyTime: string;
    earlyAccessTime: {
      hours: number;
      minutes: number;
    };
    earlyPickupLocationId: string;
    readyTimeOptions: string[];
    latestTimeOptions: string[];
  }[];
}

export interface CreatePickupData {
  associatedAccountNumber: {
    value: string;
  };
  originDetail: {
    pickupAddressType?: "ACCOUNT" | "SHIPPER" | "OTHER";
    pickupLocation: {
      contact: {
        companyName?: string;
        personName?: string;
        phoneNumber?: string;
        phoneExtension?: string;
      };
      address: {
        streetLines: string[];
        urbanizationCode?: string;
        city: string;
        stateOrProvinceCode?: string;
        postalCode: string;
        countryCode: string;
        residential?: boolean;
        addressClassification?:
          "MIXED" | "UNKNOWN" | "RESIDENTIAL" | "BUSINESS";
      };
      accountNumber?: {
        value: string;
      };
      deliveryInstructions?: string;
    };
    readyDateTimestamp: string;
    customerCloseTime: string;
    pickupDateType?: "SAME_DAY" | "FUTURE_DAY";
    packageLocation?: "FRONT" | "NONE" | "REAR" | "SIDE";
    buildingPart?:
      "APARTMENT" | "BUILDING" | "DEPARTMENT" | "FLOOR" | "ROOM" | "SUITE";
    buildingPartDescription?: string;
    earlyPickup?: boolean;
    suppliesRequested?: string;
    geographicalPostalCode?: string;
  };
  associatedAccountNumberType?: string;
  totalWeight?: FedExWeight;
  packageCount?: number;
  carrierCode: FedexCarrierCodes;
  accountAddressOfRecord?: {
    streetLines: string[];
    urbanizationCode?: string;
    city: string;
    stateOrProvinceCode: string;
    postalCode: string;
    countryCode: string;
    residential?: boolean;
    addressClassification?: "MIXED" | "UNKNOWN" | "RESIDENTIAL" | "BUSINESS";
  };
  remarks?: string;
  countryRelationships?: "DOMESTIC" | "INTERNATIONAL";
  pickupType?: "ON_CALL" | "PACKAGE_RETURN_PROGRAM" | "REGULAR_STOP";
  trackingNumber?: string;
  commodityDescription?: string;
  expressFreightDetail?: {
    truckType: "DROP_TRAILER_AGREEMENT" | "LIFTGATE" | "TRACTOR_TRAILER_ACCESS";
    service?: string;
    trailerLength?: "TRAILER_28_FT" | "TRAILER_48_FT" | "TRAILER_53_FT";
    bookingNumber?: string;
    dimensions?: FedExDimensions;
  };
  oversizePackageCount?: number;
  pickupNotificationDetail?: {
    emailDetails?: {
      address: string;
      locale?: string;
    }[];
    format: "HTML" | "TEXT";
    userMessage: string;
  };
}

export type CreatePickupResponse = FedExResponse<CreatePickupOutput>;

interface CreatePickupOutput {
  pickupConfirmationCode: string;
  location: string;
  message?: string;
}

export interface CancelPickupData {
  associatedAccountNumber: {
    value: string;
  };
  pickupConfirmationCode: string;
  remarks?: string;
  carrierCode?: FedexCarrierCodes;
  accountAddressOfRecord?: {
    streetLines: string[];
    urbanizationCode?: string;
    city: string;
    stateOrProvinceCode: string;
    postalCode: string;
    countryCode: string;
    residential?: boolean;
    addressClassification?: "MIXED" | "UNKNOWN" | "RESIDENTIAL" | "BUSINESS";
  };
  scheduledDate: string;
  location?: string;
}

export type CancelPickupResponse = FedExResponse<CancelPickupOutput>;

interface CancelPickupOutput {
  pickupConfirmationCode: string;
  cancelConfirmationMessage: string;
}
