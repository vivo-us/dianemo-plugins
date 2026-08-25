import { CurrencyCodes } from "@dianemo/plugin-kit";
import {
  FedExDimensions,
  FedExPackageType,
  FedExResponse,
  FedExServiceType,
  FedExSubPackagingType,
  FedExWeight,
  FedexCarrierCodes,
} from "../types.js";

const _FedExTrackingStatusCodeEnum = {
  AA: "At Airport",
  AC: "At Canada Post facility",
  AD: "At Delivery",
  AE: "Shipment arriving early",
  AF: "At FedEx Facility",
  AS: "Address corrected",
  AO: "Shipment arriving On-time",
  AP: "At Pickup",
  AR: "Arrived",
  AX: "At USPS facility",
  CA: "Shipment Cancelled",
  CC: "International shipment release",
  CD: "Clearance delay",
  CH: "Location Changed",
  DD: "Delivery Delay",
  DE: "Delivery Exception",
  DL: "Delivered",
  DO: "Delivered (at Original Destination)",
  DP: "Departed",
  DR: "Vehicle furnished but not used",
  DS: "Vehicle Dispatched",
  DY: "Delay",
  EA: "Enroute to Airport",
  ED: "Enroute to Delivery",
  EO: "Enroute to Origin Airport",
  EP: "Enroute to Pickup",
  FD: "At FedEx Destination",
  HA: "Hold at location request accepted",
  HL: "Hold at Location",
  HP: "Ready for recipient pickup",
  IP: "In transit",
  IT: "In Transit",
  IX: "In transit (see Details)",
  LO: "Left Origin",
  OC: "Order Created",
  OD: "Out for Delivery",
  OF: "At FedEx origin facility",
  OX: "Shipment information sent to USPS",
  PD: "Pickup Delay",
  PF: "Plane in Flight",
  PL: "Plane Landed",
  PM: "In Progress",
  PU: "Picked Up",
  PX: "Picked up (see Details)",
  RR: "CDO requested",
  RM: "CDO Modified",
  RC: "CDO Cancelled",
  RS: "Return to Shipper",
  RP: "Return label link emailed to return sender",
  LP: "Return label link cancelled by shipment originator",
  RG: "Return label link expiring soon",
  RD: "Return label link expired",
  SE: "Shipment Exception",
  SF: "At Sort Facility",
  SP: "Split Status",
} as const;

type FedExTrackingStatusCode = keyof typeof _FedExTrackingStatusCodeEnum;

type PackageIdentifierType =
  | "BILL_OF_LADING"
  | "COD_RETURN_TRACKING_NUMBER"
  | "CUSTOMER_AUTHORIZATION_NUMBER"
  | "CUSTOMER_REFERENCE"
  | "DEPARTMENT"
  | "DOCUMENT_AIRWAY_BILL"
  | "EXPRESS_ALTERNATE_REFERENCE"
  | "FEDEX_OFFICE_JOB_ORDER_NUMBER"
  | "FREE_FORM_REFERENCE"
  | "GROUND_INTERNATIONAL"
  | "GROUND_SHIPMENT_ID"
  | "GROUP_MPS"
  | "INTERNATIONAL_DISTRIBUTION"
  | "INVOICE"
  | "JOB_GLOBAL_TRACKING_NUMBER"
  | "ORDER_GLOBAL_TRACKING_NUMBER"
  | "ORDER_TO_PAY_NUMBER"
  | "OUTBOUND_LINK_TO_RETURN"
  | "PART_NUMBER"
  | "PARTNER_CARRIER_NUMBER"
  | "PURCHASE_ORDER"
  | "REROUTE_TRACKING_NUMBER"
  | "RETURN_MATERIALS_AUTHORIZATION"
  | "RETURNED_TO_SHIPPER_TRACKING_NUMBER"
  | "SHIPPER_REFERENCE"
  | "STANDARD_MPS"
  | "TRACKING_CONTROL_NUMBER"
  | "TRACKING_NUMBER_OR_DOORTAG"
  | "TRANSBORDER_DISTRIBUTION"
  | "TRANSPORTATION_CONTROL_NUMBER"
  | "VIRTUAL_CONSOLIDATION";

type ConsolidationDetailEventType = "ADDED" | "REMOVED" | "EXCLUDED";

type FedExAddressClassification =
  "BUSINESS" | "RESIDENTIAL" | "MIXED" | "UNKNOWN";

type FedExLocationType =
  | "FEDEX_AUTHORIZED_SHIP_CENTER"
  | "FEDEX_OFFICE"
  | "FEDEX_SELF_SERVICE_LOCATION"
  | "FEDEX_STAFFED"
  | "RETAIL_ALLICANCE_LOCATION"
  | "FEDEX_GROUND_TERMINAL"
  | "FEDEX_ONSITE";

type FedExDelayType =
  "WEATHER" | "OPERATIONAL" | "LOCAL" | "GENERAL" | "CLEARANCE";

type FedExDelaySubType = "SNOW" | "TORNADO" | "EARTHQUAKE" | string;

type FedExDelayStatus = "DELAYED" | "ON_TIME" | "EARLY";

type FedExServiceCommitMessageType =
  | "BROKER_DELIVERED_DESCRIPTION"
  | "CANCELLED_DESCRIPTION"
  | "DELIVERY_IN_MULTIPLE_PIECE_SHIPMENT"
  | "ESTIMATED_DELIVERY_DATE_UNAVAILABLE"
  | "EXCEPTION_IN_MULTIPLE_PIECE_SHIPMENT"
  | "FINAL_DELIVERY_ATTEMPTED"
  | "FIRST_DELIVERY_ATTEMPTED"
  | "HELD_PACKAGE_AVAILABLE_FOR_RECIPIENT_PICKUP"
  | "HELD_PACKAGE_AVAILABLE_FOR_RECIPIENT_PICKUP_WITH_ADDRESS"
  | "HELD_PACKAGE_NOT_AVAILABLE_FOR_RECIPIENT_PICKUP"
  | "SHIPMENT_LABEL_CREATED"
  | "SUBSEQUENT_DELIVERY_ATTEMPTED"
  | "USPS_DELIVERED"
  | "USPS_DELIVERING";

type FedExDistanceUnit = "KM" | "MI";

type FedExImageSize = "SMALL" | "LARGE";

type FedExImageType = "SIGNATURE_PROOF_OF_DELIVERY" | "BILL_OF_LADING";

type FedExDeliveryOption =
  | "DISPUTE_DELIVERY"
  | "INDIRECT_SIGNATURE_RELEASE"
  | "REDIRECT_TO_HOLD_AT_LOCATION"
  | "REROUTE"
  | "RESCHEDULE"
  | "RETURN_TO_SHIPPER"
  | "SUPPLEMENT_ADDRESS";

type FedExDateAndTimeType =
  | "ACTUAL_DELIVERY"
  | "ACTUAL_PICKUP"
  | "ACTUAL_TENDER"
  | "ANTICIPATED_TENDER"
  | "APPOINTMENT_DELIVERY"
  | "ATTEMPTED_DELIVERY"
  | "COMMITMENT"
  | "ESTIMATED_ARRIVAL_AT_GATEWAY"
  | "ESTIMATED_DELIVERY"
  | "ESTIMATED_PICKUP"
  | "ESTIMATED_RETURN_TO_STATION"
  | "SHIP"
  | "SHIPMENT_DATA_RECEIVED";

type FedExCustomDeliveryOptionType =
  | "REROUTE"
  | "APPOINTMENT"
  | "DATE_CERTAIN"
  | "EVENING"
  | "REDIRECT_TO_HOLD_AT_LOCATION"
  | "ELECTRONIC_SIGNATURE_RELEASE";

type FedExPieceCountType = "DESTINATION" | "ORIGIN";

interface FedExWindow {
  description?: string;
  window?: {
    begins: string;
    ends: string;
  };
  type?: FedExDateAndTimeType;
}

interface FedExDistance {
  unit: FedExDistanceUnit;
  value: number;
}

interface FedExReason {
  description: string;
  type: string;
}

interface FedExDelayDetail {
  type: FedExDelayType;
  subType: FedExDelaySubType;
  status: FedExDelayStatus;
}

export interface TrackPackagesRequest {
  includeDetailedScans: boolean;
  trackingInfo: {
    /** Format YYYY-MM-DD */
    shipDateBegin?: string;
    /** Format YYYY-MM-DD */
    shipDateEnd?: string;
    trackingNumberInfo: {
      trackingNumber: string;
      carrierCode?: FedexCarrierCodes;
      trackingNumberUniqueId?: string;
    };
  }[];
}

export type TrackPackagesResponse = FedExResponse<TrackPackagesOutput>;

interface TrackPackagesOutput {
  completeTrackResults: CompleteTrackResults[];
}

interface CompleteTrackResults {
  trackingNumber: string;
  trackResults: TrackResult[];
}

export interface TrackResult {
  trackingNumberInfo: TrackingNumberInfo;
  additionalTrackingInfo: AdditionalTrackingInfo;
  serviceDetail: ServiceDetail;
  latestStatusDetail: LatestStatusDetail;
  serviceCommitMessage: ServiceCommitMessage;
  availableImages: AvailableImage[];
  deliveryDetails: DeliveryDetails;
  scanEvents: ScanEvent[];
  packageDetails: PackageDetails;
  estimatedDeliveryTimeWindow: FedExWindow;
  recipientInformation: TrackPackageContactAndAddress;
  standardTransitTimeWindow: FedExWindow;
  shipmentDetails: ShipmentDetails;
  availableNotifications: string[];
  shipperInformation: TrackPackageContactAndAddress;
  lastUpdatedDestinationAddress: TrackPackageAddress;
  distanceToDestination?: FedExDistance;
  consolidationDetail?: ConsolidationDetail[];
  meterNumber?: string;
  returnDetail?: ReturnDetail;
  destinationLocation?: TrackPackageLocation;
  informationNotes?: InformationNote[];
  error?: {
    code: string;
    parameterList: {
      value: string;
      key: string;
    }[];
    message: string;
  };
  specialHandlings?: SpecialHandling[];
  goodsClassificationCode?: string;
  dateAndTimes?: DateAndTime[];
  holdAtLocation?: TrackPackageLocation;
  customDeliveryOptions?: CustomDeliveryOption[];
  pieceCounts?: PieceCount[];
  originLocation?: TrackPackageLocation;
  reasonDetail?: FedExReason;
}

interface TrackingNumberInfo {
  trackingNumber: string;
  carrierCode: FedexCarrierCodes;
  trackingNumberUniqueId: string;
}

interface AdditionalTrackingInfo {
  hasAssociatedShipments: boolean;
  nickname: string;
  packageIdentifiers?: PackageIdentifier[];
  shipmentNotes?: string;
}

interface PackageIdentifier {
  type: PackageIdentifierType;
  value: string;
  trackingNumberUniqueId: string;
}

interface ConsolidationDetail {
  timeStamp: string;
  consolidationID: string;
  reasonDetail: FedExReason;
  packageCount: number;
  eventType: ConsolidationDetailEventType;
}

interface ReturnDetail {
  authorizationName: string;
  reasonDetail: FedExReason[];
}

interface ServiceDetail {
  descripition: string;
  shortDescription: string;
  type: FedExServiceType;
}

interface TrackPackageAddress {
  residential: boolean;
  addressClassification?: FedExAddressClassification;
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  urbanizationCode?: string;
  postalCode?: string;
  countryCode?: string;
  countryName?: string;
}

interface LatestStatusDetail {
  scanLocation: TrackPackageAddress;
  code: string;
  derivedCode: string;
  statusByLocale: string;
  description: string;
  delayDetail?: FedExDelayDetail;
  ancillaryDetails: {
    reason: string;
    reasonDescription: string;
    action: string;
    actionDescription: string;
  }[];
}

interface ServiceCommitMessage {
  message: string;
  type: FedExServiceCommitMessageType;
}

interface InformationNote {
  code: string;
  description: string;
}

interface SpecialHandling {
  type: string;
  description: string;
  paymentType: string;
}

interface AvailableImage {
  size: FedExImageSize;
  type: FedExImageType;
}

interface DeliveryDetails {
  destinationServiceArea: string;
  deliveryAttempts: number;
  deliveryOptionEligibilityDetails: {
    option: FedExDeliveryOption;
    eligibility: string;
  }[];
  receivedByName?: string;
  destinationServiceAreaDescription?: string;
  locationDescription?: string;
  actualDeliveryAddress?: TrackPackageAddress;
  deliveryToday?: boolean;
  locationType?: FedExLocationType;
  signedByName?: string;
  officeOrderDeliveryMethod?: string;
}

export interface ScanEvent {
  date: string;
  derivedStatus: FedExTrackingStatusCode;
  scanLocation: TrackPackageAddress;
  locationId?: string;
  locationType: FedExLocationType;
  exceptionDescription: string;
  eventDescription?: string;
  eventType: FedExTrackingStatusCode;
  derivedStatusCode: string;
  exceptionCode?: string;
  delayDetail?: FedExDelayDetail;
}

interface DateAndTime {
  dateTime: string;
  type: FedExDateAndTimeType;
}

interface PackageDetails {
  physicalPackagingType: FedExSubPackagingType;
  sequenceNumber: string;
  undeliveredCount?: string;
  packagingDescription: {
    type: FedExPackageType;
    description: string;
  };
  count: string;
  weightAndDimensions: {
    weight: FedExWeight[];
    dimensions: FedExDimensions[];
  };
  packageContent: string[];
  contentPieceCount?: string;
  declaredValue?: {
    currency: CurrencyCodes;
    value: number;
  };
}

interface TrackPackageContactAndAddress {
  contact?: {
    personName: string;
    phoneNumber: string;
    companyName: string;
  };
  address: TrackPackageAddress;
}

interface TrackPackageLocation {
  locationId: string;
  locationContactAndAddress: TrackPackageContactAndAddress;
  locationType: FedExLocationType;
}

interface CustomDeliveryOption {
  requestedAppointmentDetail: {
    date: string;
    window: FedExWindow[];
  };
  description: string;
  type: FedExCustomDeliveryOptionType;
}

interface PieceCount {
  count: string;
  description: string;
  type: FedExPieceCountType;
}

interface ShipmentDetails {
  possessionStatus: boolean;
  contents?: {
    itemNumber: string;
    receivedQuantity: string;
    description: string;
    partNumber: string;
  }[];
  beforePossessionStatus?: boolean;
  weight?: FedExWeight[];
  contentPieceCount?: string;
  splitShipments?: {
    pieceCount: string;
    statusDescription: string;
    timestamp: string;
    statusCode: string;
  }[];
}
