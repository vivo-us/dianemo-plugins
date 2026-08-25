export interface GetSupplySourcesResponse {
  supplySources: BaseSupplySource[];
  nextPageToken?: string;
}

export interface BaseSupplySource {
  alias: string;
  supplySourceId: string;
  supplySourceCode: string;
  address?: Address;
}

export interface SupplySource extends BaseSupplySource {
  status?: "Active" | "Inactive" | "Archived";
  configuration?: {
    operationalConfiguration?: OperationalConfiguration;
    timezone?: string;
  };
  capabilities?: {
    outbound?: {
      isSupported?: boolean;
      operationalConfiguration?: OperationalConfiguration;
      returnLocation?: {
        supplySourceId?: string;
        addressWithContact?: AddressWithContact;
      };
      deliveryChannel?: {
        isSupported?: boolean;
        operationalConfiguration?: OperationalConfiguration;
      };
      pickupChannel?: {
        inventoryHoldPeriod?: Duration;
        isSupported?: boolean;
        operationalConfiguration?: OperationalConfiguration;
        inStorePickupConfiguration?: {
          isSupported?: boolean;
          parkingConfiguration?: ParkingConfiguration;
        };
        curbsidePickupConfiguration?: {
          isSupported?: boolean;
          operationalConfiguration?: OperationalConfiguration;
          parkingWithAddressConfiguration?: ParkingConfigurationWithAddress;
        };
      };
    };
    services?: {
      isSupported?: boolean;
      operationalConfiguration?: OperationalConfiguration;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

interface OperationalConfiguration {
  contactDetails?: ContactDetails;
  throughputConfig?: {
    throughputCap?: Duration;
    throughputUnit: "Order";
  };
  operatingHoursByDay?: {
    monday?: OperatingHours[];
    tuesday?: OperatingHours[];
    wednesday?: OperatingHours[];
    thursday?: OperatingHours[];
    friday?: OperatingHours[];
    saturday?: OperatingHours[];
    sunday?: OperatingHours[];
  };
  handlingTime?: Duration;
}

interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  county?: string;
  district?: string;
  stateOrRegion: string;
  postalCode?: string;
  countryCode: string;
  phone?: string;
}

interface ContactDetails {
  primary?: {
    email?: string;
    phone?: string;
  };
}

interface AddressWithContact {
  address?: Address;
  contactDetails?: ContactDetails;
}

interface OperatingHours {
  startTime?: string;
  endTime?: string;
}

interface Duration {
  value?: number;
  timeUnit?: "Hours" | "Days" | "Minutes";
}

interface ParkingConfiguration {
  parkingCostType?: "Free" | "Other";
  parkingSpotIdentificationType?: "Numbered" | "Other";
  numberOfParkingSpots?: number;
}
interface ParkingConfigurationWithAddress {
  parkingConfiguration?: ParkingConfiguration;
  address?: Address;
}
