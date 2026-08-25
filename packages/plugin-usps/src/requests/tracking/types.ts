export interface UspsTrackingDetails {
  trackingNumber: string;
  additionalInfo?: string;
  mailClass?: string;
  status?: string;
  statusCategory?: string;
  statusSummary?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationZIP?: string;
  destinationCountryCode?: string;
  originCity?: string;
  originState?: string;
  originZIP?: string;
  originCountry?: string;
  expectedDeliveryTimeStamp?: string;
  expectedDeliveryType?: string;
  guaranteedDeliveryTimeStamp?: string;
  predictedDeliveryDate?: string;
  predictedDeliveryWindowStartTime?: string;
  predictedDeliveryWindowEndTime?: string;
  onTime?: boolean;
  itemShape?: "LETTER" | "FLAT" | "PARCEL" | "UNKNOWN";
  mailType?:
    | "INTERNATIONAL_INBOUND"
    | "INTERNATIONAL_OUTBOUND"
    | "DOMESTIC_MAIL"
    | "UNKNOWN";
  trackingEvents?: UspsTrackingEvent[];
  trackingProofOfDeliveryEnabled?: boolean;
  proofOfDeliveryEnabled?: boolean;
  restoreEnabled?: boolean;
  redeliveryEnabled?: boolean;
  carrierRelease?: boolean;
  editedLabelId?: string;
  emailEnabled?: boolean;
  endOfDay?: string;
  eSOFEligible?: boolean;
  guaranteedDetails?: string;
  RRAMenabled?: boolean;
  RREEnabled?: boolean;
  services?: string[];
  relatedReturnReceiptID?: string;
  returnDateNotice?: string;
  valueofArticle?: string;
  enabledNotificationRequests?: {
    SMS?: Record<string, boolean>;
    EMail?: Record<string, boolean>;
  };
  uniqueMailPieceId?: string;
  mailPieceIntakeDate?: string;
  tableCode?: string;
  serviceTypeCode?: string;
}

export interface UspsTrackingEvent {
  eventType?: string;
  eventTimestamp?: string;
  GMTTimestamp?: string;
  GMTOffset?: string;
  eventCountry?: string;
  eventCity?: string;
  eventState?: string;
  eventZIP?: string;
  firm?: string;
  name?: string;
  authorizedAgent?: boolean;
  eventCode?: string;
  veriPoint?: boolean;
  actionCode?: string;
  reasonCode?: string;
}
