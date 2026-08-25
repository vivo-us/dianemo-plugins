const _UPSTrackingActivityStatusTypeEnum = {
  D: "Delivered",
  I: "In Transit",
  M: "Billing Information Received",
  MV: "Billing Information Voided",
  P: "Pickup",
  X: "Exception",
  RS: "Returned to Shipper",
  DO: "Delivered Origin CFS (Freight Only)",
  DD: "Delivered Destination CFS (Freight Only)",
  W: "Warehousing (Freight Only)",
  NA: "Not Available",
  O: "Out for Delivery",
} as const;

const _UPSTrackingActivityStatusCodeEnum = {
  MP: "Shipper created a label, UPS has not received the package yet.",
  OR: "Origin Scan",
  DS: "Processing at UPS Facility",
  YP: "Processing at UPS Facility",
  YI: "Out For Delivery to UPS Access Point",
  DP: "Departed from Facility",
  AR: "Arrived at Facility",
  OF: "Loaded on Delivery Vehicle",
  OT: "Out For Delivery Today",
  KB: "Signature obtained",
  FS: "DELIVERED",
  IP: "Import Scan",
  "2W": "DELIVERED",
  "8Q": "DELIVERED",
  "9E": "DELIVERED",
  VP: "Voided Information Received ",
  ZA: "The package will be delivered to the recipient's preferred UPS Access Point™ location.",
  ZC: "The package will be delivered to the recipient's preferred UPS Access Point™ location.",
  ZP: "UPS Access Point™ possession ",
} as const;

type UPSTrackingActivityStatusType =
  keyof typeof _UPSTrackingActivityStatusTypeEnum;

type UPSTrackingActivityStatusCode =
  keyof typeof _UPSTrackingActivityStatusCodeEnum;

type UPSTrackingActivityStatusDescription =
  (typeof _UPSTrackingActivityStatusCodeEnum)[UPSTrackingActivityStatusCode];

export interface TrackPackageResponse {
  trackResponse: {
    shipment: UpsShipment[];
  };
}

export interface UpsShipment {
  inquiryNumber: string;
  package: Package[];
  userRelation: string[];
  warnings?: Warning[];
}

interface Status {
  code: string;
  description: UPSTrackingActivityStatusDescription;
  simplifiedTextDescription?: string;
  statusCode: UPSTrackingActivityStatusCode;
  type: UPSTrackingActivityStatusType;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  country: string;
  countryCode: string;
  postalCode: string;
  stateProvince: string;
}

interface Warning {
  code: string;
  message: string;
}

interface Package {
  accessPointInformation: {
    pickupByDate: string;
  };
  activity: Activity[];
  additionalAttributes: string[];
  additionalServices: string[];
  alternativeTrackingNumber: {
    number: string;
    type: string;
  }[];
  currentStatus: Status;
  deliveryDate: {
    date: string;
    /**
     * RDD: Rescheduled Delivery Date
     * SDD: Scheduled Delivery Date
     * DEL: Delivery Date
     */
    type: "RDD" | "SDD" | "DEL";
  }[];
  deliveryInformation: {
    location: string;
    receivedBy: string;
    signature: {
      image: string;
    };
  };
  deliveryTime: {
    endTime: string;
    startTime: string;
    type: string;
  };
  milestones: MileStone[];
  packageAddress: PackageAddress[];
  packageCount: number;
  paymentInformation: PaymentInformation[];
  referenceNumber: ReferenceNumber[];
  service: Service;
  statusCode: string;
  statusDescription: string;
  suppressionIndicators: string[];
  trackingNumber: string;
  weight: {
    unitOfMeasurement: string;
    weight: string;
  };
}

export interface Activity {
  date: string;
  location: {
    address: Address;
    slic: string;
  };
  status: Status;
  time: string;
}

interface MileStone {
  category: string;
  code: string;
  current: boolean;
  description: string;
  linkedActivity: string;
  state: string;
  subMilestone: {
    category: string;
  };
}

interface PackageAddress {
  address: Address;
  attentionName: string;
  name: string;
  type: string;
}

interface PaymentInformation {
  amount: string;
  currency: string;
  id: string;
  paid: boolean;
  paymentMethod: string;
  type: string;
}

interface ReferenceNumber {
  number: string;
  type: string;
}

interface Service {
  code: string;
  description: string;
}
