import type { UspsAddress } from "../types.js";

export interface UspsPickupEligibilityParams {
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  urbanization?: string;
}

export type UspsPackageType =
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "PRIORITY_MAIL_EXPRESS"
  | "PRIORITY_MAIL"
  | "RETURNS"
  | "USPS_GROUND_ADVANTAGE"
  | "INTERNATIONAL"
  | "OTHER";

export type UspsPickupLocationType =
  | "FRONT_DOOR"
  | "BACK_DOOR"
  | "SIDE_DOOR"
  | "KNOCK_ON_DOOR"
  | "MAIL_ROOM"
  | "OFFICE"
  | "PORCH"
  | "RECEPTION"
  | "MAILBOX"
  | "OTHER";

export interface UspsSchedulePickupRequest {
  pickupDate: string;
  pickupAddress: {
    firstName: string;
    lastName: string;
    firm?: string;
    address: UspsAddress;
    contact: Array<{ email: string } | { cellNumber: string }>;
  };
  packages: Array<{
    packageType: UspsPackageType;
    packageCount: number;
  }>;
  estimatedWeight: number;
  pickupLocation: {
    packageLocation: UspsPickupLocationType;
    specialInstructions?: string;
    dogPresent?: boolean;
  };
  nextAvailablePickup?: boolean;
}

export interface UspsPickupEligibilityResponse {
  firstName: string;
  lastName: string;
  firm?: string;
  address: UspsAddress;
  contact: Array<{ email: string } | { cellNumber: string }>;
}

export interface UspsPickupConfirmation {
  confirmationNumber: string;
  pickupDate: string;
  carrierPickupRequest?: UspsSchedulePickupRequest;
}

export interface UspsPickupDetails {
  confirmationNumber: string;
  pickupDate: string;
  carrierPickupRequest?: UspsSchedulePickupRequest;
}
