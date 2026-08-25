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

export enum VariableOption {
  SATURDAY_DELIVERY = "SATURDAY_DELIVERY",
  FREIGHT_GUARANTEE = "FREIGHT_GUARANTEE",
  SMART_POST_ALLOWED_INDICIATOR = "SMART_POST_ALLOWED_INDICIA",
  SMARTPOST_HUB_ID = "SMARTPOST_HUB_ID",
}

export enum RateSortOrder {
  COMMIT_ASCENDING = "COMMITASCENDING",
  SERVICE_NAME_TRADITIONAL = "SERVICENAMETRADITIONAL",
  COMMIT_DESCENDING = "COMMITDESCENDING",
}

export enum NotificationFormatType {
  HTML = "HTML",
  TEXT = "TEXT",
}

export enum EmailNotificationRecipientType {
  BROKER = "BROKER",
  OTHER = "OTHER",
  RECIPIENT = "RECIPIENT",
  SHIPPER = "SHIPPER",
  THIRD_PARTY = "THIRD_PARTY",
  OTHER1 = "OTHER1",
  OTHER2 = "OTHER2",
}

export enum PackageSpecialService {
  ALCOHOL = "ALCOHOL",
  APPOINTMENT = "APPOINTMENT",
  BATTERY = "BATTERY",
  COD = "COD",
  DANGEROUS_GOODS = "DANGEROUS_GOODS",
  DRY_ICE = "DRY_ICE",
  PRIORITY_ALERT = "PRIORITY_ALERT",
  PRIORITY_ALERT_PLUS = "PRIORITY_ALERT_PLUS",
  NON_STANDARD_CONTAINER = "NON_STANDARD_CONTAINER",
  PIECE_COUNT_VERIFICATION = "PIECE_COUNT_VERIFICATION",
  SIGNATURE_OPTION = "SIGNATURE_OPTION",
  EVENING = "EVENING",
  DATE_CERTAIN = "DATE_CERTAIN",
  SATURDAY_PICKUP = "SATURDAY_PICKUP",
}

export enum NotificationEventType {
  ON_DELIVERY = "ON_DELIVERY",
  ON_EXCEPTION = "ON_EXCEPTION",
  ON_SHIPMENT = "ON_SHIPMENT",
  ON_TENDER = "ON_TENDER",
  ON_ESTIMATED_DELIVERY = "ON_ESTIMATED_DELIVERY",
  ON_PICKUP = "ON_PICKUP",
  ON_LABEL = "ON_LABEL",
  ON_BILL_OF_LADING = "ON_BILL_OF_LADING",
}

export enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS_TEXT_MESSAGE",
}

export enum Locale {
  ar_AE = "ar_AE",
  bg_BG = "bg_BG",
  zh_CN = "zh_CN",
  zh_HK = "zh_HK",
  zh_TW = "zh_TW",
  cs_CZ = "cs_CZ",
  da_DK = "da_DK",
  nl_NL = "nl_NL",
  en_CA = "en_CA",
  en_GB = "en_GB",
  en_US = "en_US",
  et_EE = "et_EE",
  fi_FI = "fi_FI",
  fr_CA = "fr_CA",
  fr_FR = "fr_FR",
  de_DE = "de_DE",
  de_CH = "de_CH",
  el_GR = "el_GR",
  hu_HU = "hu_HU",
  it_IT = "it_IT",
  ja_JP = "ja_JP",
  ko_KR = "ko_KR",
  lv_LV = "lv_LV",
  lt_LT = "lt_LT",
  no_NO = "no_NO",
  pl_PL = "pl_PL",
  pt_BR = "pt_BR",
  pt_PT = "pt_PT",
  ro_RO = "ro_RO",
  ru_RU = "ru_RU",
  sk_SK = "sk_SK",
  sl_SI = "sl_SI",
  es_AR = "es_AR",
  es_MX = "es_MX",
  es_ES = "es_ES",
  es_US = "es_US",
  sv_SE = "sv_SE",
  th_TH = "th_TH",
  tr_TR = "tr_TR",
  uk_UA = "uk_UA",
  vi_VN = "vi_VN",
}

export enum PrintedReferenceType {
  BILL_OF_LADING = "BILL_OF_LADING",
  CONSIGNEE_ID_NUMBER = "CONSIGNEE_ID_NUMBER",
  INTERLINE_PRO_NUMBER = "INTERLINE_PRO_NUMBER",
  PO_NUMBER = "PO_NUMBER",
  SHIPPER_ID_NUMBER = "SHIPPER_ID_NUMBER",
  SHIPPER_ID1_NUMBER = "SHIPPER_ID1_NUMBER",
  SHIPPER_ID2_NUMBER = "SHIPPER_ID2_NUMBER",
}

/**
 * Indicate the type of rates to be returned.
 * @example ["LIST","PREFERRED"]
 */
export type RateRequestType =
  /** Returns FedEx published list rates in addition to account-specific rates (if applicable). */
  | "LIST"
  /** Returns rates in the preferred currency specified in the element preferredCurrency. */
  | "PREFERRED"
  /** Returns account specific rates (Default). */
  | "ACCOUNT"
  /** This is one-time discount for incentivising the customer. For more information, contact your FedEx representative. */
  | "INCENTIVE";

export type PickupType =
  | "CONTACT_FEDEX_TO_SCHEDULE"
  | "DROPOFF_AT_FEDEX_LOCATION"
  | "USE_SCHEDULED_PICKUP"
  /** Indicates the pickup will be scheduled by calling FedEx. */
  | "ON_CALL"
  /** Indicates the pickup by FedEx Ground Package Returns Program. */
  | "PACKAGE_RETURN_PROGRAM"
  /** Indicates the pickup at the regular pickup schedule. */
  | "REGULAR_STOP"
  /** Indicates the pickup specific to an Express tag or Ground call tag pickup request. */
  | "TAG";

export enum RateType {
  ACCOUNT = "ACCOUNT",
  ACTUAL = "ACTUAL",
  CURRENT = "CURRENT",
  CUSTOM = "CUSTOM",
  LIST = "LIST",
  INCENTIVE = "INCENTIVE",
  PREFERRED = "PREFERRED",
  PREFERRED_INCENTIVE = "PREFERRED_INCENTIVE",
  PREFERRED_CURRENCY = "PREFERRED_CURRENCY",
}

export enum RateLevelType {
  BUNDLED_RATE = "BUNDLED_RATE",
  INDIVIDUAL_PACKAGE_RATE = "INDIVIDUAL_PACKAGE_RATE",
}

export enum RateElementBasis {
  NET_CHARGE = "NET_CHARGE",
  NET_FREIGHT = "NET_FREIGHT",
  BASE_CHARGE = "BASE_CHARGE",
  NET_CHARGE_EXCLUDING_TAXES = "NET_CHARGE_EXCLUDING_TAXES",
}

export enum ShipmentPurpose {
  GIFT = "GIFT",
  NOT_SOLD = "NOT_SOLD",
  PERSONAL_EFFECTS = "PERSONAL_EFFECTS",
  REPAIR_AND_RETURN = "REPAIR_AND_RETURN",
  SAMPLE = "SAMPLE",
  SOLD = "SOLD",
  COMMERCIAL = "COMMERCIAL",
  RETURN_AND_REPAIR = "RETURN_AND_REPAIR",
  PERSONAL_USE = "PERSONAL_USE",
}

export enum FreightOnValue {
  CARRIER_RISK = "CARRIER_RISK",
  OWN_RISK = "OWN_RISK",
}

export enum AncillaryEndorsement {
  ADDRESS_CORRECTION = "ADDRESS_CORRECTION",
  CARRIER_LEAVE_IF_NO_RESPONSE = "CARRIER_LEAVE_IF_NO_RESPONSE",
  CHANGE_SERVICE = "CHANGE_SERVICE",
  FORWARDING_SERVICE = "FORWARDING_SERVICE",
  RETURN_SERVICE = "RETURN_SERVICE",
}

export enum SmartPostHubId {
  NOMA = "5015",
  WICT = "5061",
  EDNJ = "5087",
  NENJ = "5095",
  SBNJ = "5097",
  NENY = "5110",
  PTPA = "5150",
  MAPA = "5183",
  ALPA = "5185",
  SCPA = "5186",
  PHPA = "5194",
  BAMD = "5213",
  MAWV = "5254",
  CHNC = "5281",
  ATGA = "5303",
  ORFL = "5327",
  TAFL = "5345",
  METN = "5379",
  GCOH = "5431",
  GPOH = "5436",
  ININ = "5465",
  DTMI = "5481",
  NBWI = "5531",
  MPMN = "5552",
  WHIL = "5602",
  STMO = "5631",
  KCKS = "5648",
  DLTX = "5751",
  HOTX = "5771",
  DNCO = "5802",
  SCUT = "5843",
  PHAZ = "5854",
  RENV = "5893",
  LACA = "5902",
  COCA = "5929",
  SACA = "5958",
  SEWA = "5983",
}

export enum Indicia {
  PARCEL_SELECT = "PARCEL_SELECT",
  PARCEL_RETURN = "PARCEL_RETURN",
  MEDIA_MAIL = "MEDIA_MAIL",
  PRESORTED_BOUND_PRINTED_MATTER = "PRESORTED_BOUND_PRINTED_MATTER",
  PRESORTED_STANDARD = "PRESORTED_STANDARD",
}

export enum SpecialService {
  /** FedEx Appointment Home Delivery® */
  APPOINTMENT = "APPOINTMENT",
  BROKER_SELECT_OPTION = "BROKER_SELECT_OPTION",
  CALL_BEFORE_DELIVERY = "CALL_BEFORE_DELIVERY",
  /** Collect on Delivery (COD) */
  COD = "COD",
  CUSTOM_DELIVERY_WINDOW = "CUSTOM_DELIVERY_WINDOW",
  CUT_FLOWERS = "CUT_FLOWERS",
  DO_NOT_BREAK_DOWN_PALLETS = "DO_NOT_BREAK_DOWN_PALLETS",
  DO_NOT_STACK_PALLETS = "DO_NOT_STACK_PALLETS",
  DRY_ICE = "DRY_ICE",
  /** East Coast Special Service */
  EAST_COAST_SPECIAL = "EAST_COAST_SPECIAL",
  EXCLUDE_FROM_CONSOLIDATION = "EXCLUDE_FROM_CONSOLIDATION",
  EXTREME_LENGTH = "EXTREME_LENGTH",
  INSIDE_DELIVERY = "INSIDE_DELIVERY",
  INSIDE_PICKUP = "INSIDE_PICKUP",
  INTERNATIONAL_CONTROLLED_EXPORT_SERVICE = "INTERNATIONAL_CONTROLLED_EXPORT_SERVICE",
  FEDEX_ONE_RATE = "FEDEX_ONE_RATE",
  /** FedEx Third Party Consignee International Priority service (TPC) */
  THIRD_PARTY_CONSIGNEE = "THIRD_PARTY_CONSIGNEE",
  ELECTRONIC_TRADE_DOCUMENTS = "ELECTRONIC_TRADE_DOCUMENTS",
  FOOD = "FOOD",
  FUTURE_DAY_SHIPMENT = "FUTURE_DAY_SHIPMENT",
  HOLD_AT_LOCATION = "HOLD_AT_LOCATION",
  /** International Traffic in Arms Regulations(ITAR) */
  INTERNATIONAL_TRAFFIC_IN_ARMS_REGULATIONS = "INTERNATIONAL_TRAFFIC_IN_ARMS_REGULATIONS",
  LIFTGATE_DELIVERY = "LIFTGATE_DELIVERY",
  LIFTGATE_PICKUP = "LIFTGATE_PICKUP",
  LIMITED_ACCESS_DELIVERY = "LIMITED_ACCESS_DELIVERY",
  LIMITED_ACCESS_PICKUP = "LIMITED_ACCESS_PICKUP",
  OVER_LENGTH = "OVER_LENGTH",
  PENDING_SHIPMENT = "PENDING_SHIPMENT",
  PHARMACY_DELIVERY = "PHARMACY_DELIVERY",
  POISON = "POISON",
  /** Premium Home Delivery */
  HOME_DELIVERY_PREMIUM = "HOME_DELIVERY_PREMIUM",
  PROTECTION_FROM_FREEZING = "PROTECTION_FROM_FREEZING",
  RETURNS_CLEARANCE = "RETURNS_CLEARANCE",
  RETURN_SHIPMENT = "RETURN_SHIPMENT",
  SATURDAY_DELIVERY = "SATURDAY_DELIVERY",
  SATURDAY_PICKUP = "SATURDAY_PICKUP",
  /** Shipment Event Notification */
  EVENT_NOTIFICATION = "EVENT_NOTIFICATION",
  DELIVERY_ON_INVOICE_ACCEPTANCE = "DELIVERY_ON_INVOICE_ACCEPTANCE",
  TOP_LOAD = "TOP_LOAD",
  FREIGHT_GUARANTEE = "FREIGHT_GUARANTEE",
}

export enum AlertType {
  NOTE = "NOTE",
  WARNING = "WARNING",
}

export enum RatedWeightMethod {
  ACTUAL = "ACTUAL",
  AVERAGE_PACKAGE_WEIGHT_MINIMUM = "AVERAGE_PACKAGE_WEIGHT_MINIMUM",
  DEFAULT_WEIGHT_APPLIED = "DEFAULT_WEIGHT_APPLIED",
  BALLOON = "BALLOON",
  DIM = "DIM",
  FREIGHT_MINIMUM = "FREIGHT_MINIMUM",
  MIXED = "MIXED",
  OVERSIZE = "OVERSIZE",
  OVERSIZE_1 = "OVERSIZE_1",
  OVERSIZE_2 = "OVERSIZE_2",
  OVERSIZE_3 = "OVERSIZE_3",
  PACKAGING_MINIMUM = "PACKAGING_MINIMUM",
  WEIGHT_BREAK = "WEIGHT_BREAK",
}

export enum FreightChargeBasis {
  CWT = "CWT",
  FLAT = "FLAT",
  MINIMUM = "MINIMUM",
}

export enum SurchargeType {
  ACCOUNT_NUMBER_PROCESSING_FEE = "ACCOUNT_NUMBER_PROCESSING_FEE",
  ADDITIONAL_HANDLING = "ADDITIONAL_HANDLING",
  ADDRESS_CORRECTION = "ADDRESS_CORRECTION",
  ANCILLARY_FEE = "ANCILLARY_FEE",
  BLIND_SHIPMENT = "BLIND_SHIPMENT",
  BROKER_SELECT_OPTION = "BROKER_SELECT_OPTION",
  CANADIAN_DESTINATION = "CANADIAN_DESTINATION",
  CHARGEABLE_PALLET_WEIGHT = "CHARGEABLE_PALLET_WEIGHT",
  CLEARANCE_ENTRY_FEE = "CLEARANCE_ENTRY_FEE",
  COD = "COD",
  CUT_FLOWERS = "CUT_FLOWERS",
  DANGEROUS_GOODS = "DANGEROUS_GOODS",
  DELIVERY_AREA = "DELIVERY_AREA",
  DELIVERY_CONFIRMATION = "DELIVERY_CONFIRMATION",
  DELIVERY_ON_INVOICE_ACCEPTANCE = "DELIVERY_ON_INVOICE_ACCEPTANCE",
  DETENTION = "DETENTION",
  DOCUMENTATION_FEE = "DOCUMENTATION_FEE",
  DRY_ICE = "DRY_ICE",
  EMAIL_LABEL = "EMAIL_LABEL",
  EUROPE_FIRST = "EUROPE_FIRST",
  EXCESS_VALUE = "EXCESS_VALUE",
  EXCLUSIVE_USE = "EXCLUSIVE_USE",
  EXHIBITION = "EXHIBITION",
  EXPEDITED = "EXPEDITED",
  EXPORT = "EXPORT",
  EXTRA_LABOR = "EXTRA_LABOR",
  EXTRA_SURFACE_HANDLING_CHARGE = "EXTRA_SURFACE_HANDLING_CHARGE",
  EXTREME_LENGTH = "EXTREME_LENGTH",
  FEDEX_INTRACOUNTRY_FEES = "FEDEX_INTRACOUNTRY_FEES",
  FEDEX_TAG = "FEDEX_TAG",
  FICE = "FICE",
  FLATBED = "FLATBED",
  FUEL = "FUEL",
  HOLD_AT_LOCATION = "HOLD_AT_LOCATION",
  HOLIDAY_DELIVERY = "HOLIDAY_DELIVERY",
  HOLIDAY_GUARANTEE = "HOLIDAY_GUARANTEE",
  HOME_DELIVERY_APPOINTMENT = "HOME_DELIVERY_APPOINTMENT",
  DATE_CERTAIN = "DATE_CERTAIN",
  EVENING = "EVENING",
  INSIDE_DELIVERY = "INSIDE_DELIVERY",
  INSIDE_PICKUP = "INSIDE_PICKUP",
  INSURED_VALUE = "INSURED_VALUE",
  INTERHAWAII = "INTERHAWAII",
  LIFTGATE_DELIVERY = "LIFTGATE_DELIVERY",
  LIFTGATE_PICKUP = "LIFTGATE_PICKUP",
  LIMITED_ACCESS_DELIVERY = "LIMITED_ACCESS_DELIVERY",
  LIMITED_ACCESS_PICKUP = "LIMITED_ACCESS_PICKUP",
  MARKING_OR_TAGGING = "MARKING_OR_TAGGING",
  METRO_DELIVERY = "METRO_DELIVERY",
  METRO_PICKUP = "METRO_PICKUP",
  NON_BUSINESS_TIME = "NON_BUSINESS_TIME",
  NON_MACHINABLE = "NON_MACHINABLE",
  OFFSHORE = "OFFSHORE",
  ON_CALL_PICKUP = "ON_CALL_PICKUP",
  ON_DEMAND_CARE = "ON_DEMAND_CARE",
  OTHER = "OTHER",
  OUT_OF_DELIVERY_AREA = "OUT_OF_DELIVERY_AREA",
  OUT_OF_PICKUP_AREA = "OUT_OF_PICKUP_AREA",
  OVERSIZE = "OVERSIZE",
  OVER_DIMENSION = "OVER_DIMENSION",
  OVER_LENGTH = "OVER_LENGTH",
  PALLETS_PROVIDED = "PALLETS_PROVIDED",
  PALLET_SHRINKWRAP = "PALLET_SHRINKWRAP",
  PEAK = "PEAK",
  PEAK_ADDITIONAL_HANDLING = "PEAK_ADDITIONAL_HANDLING",
  PEAK_OVERSIZE = "PEAK_OVERSIZE",
  PEAK_RESIDENTIAL_DELIVERY = "PEAK_RESIDENTIAL_DELIVERY",
  PIECE_COUNT_VERIFICATION = "PIECE_COUNT_VERIFICATION",
  PORT = "PORT",
  PRE_DELIVERY_NOTIFICATION = "PRE_DELIVERY_NOTIFICATION",
  PRIORITY_ALERT = "PRIORITY_ALERT",
  PROTECTION_FROM_FREEZING = "PROTECTION_FROM_FREEZING",
  REGIONAL_MALL_DELIVERY = "REGIONAL_MALL_DELIVERY",
  REGIONAL_MALL_PICKUP = "REGIONAL_MALL_PICKUP",
  REROUTE = "REROUTE",
  RESCHEDULE = "RESCHEDULE",
  RESIDENTIAL_DELIVERY = "RESIDENTIAL_DELIVERY",
  RESIDENTIAL_PICKUP = "RESIDENTIAL_PICKUP",
  RETURN_LABEL = "RETURN_LABEL",
  SATURDAY_DELIVERY = "SATURDAY_DELIVERY",
  SATURDAY_PICKUP = "SATURDAY_PICKUP",
  SHIPMENT_ASSEMBLY = "SHIPMENT_ASSEMBLY",
  SIGNATURE_OPTION = "SIGNATURE_OPTION",
  SORT_AND_SEGREGATE = "SORT_AND_SEGREGATE",
  SPECIAL_EQUIPMENT = "SPECIAL_EQUIPMENT",
  SPECIAL_DELIVERY = "SPECIAL_DELIVERY",
  SUNDAY_DELIVERY = "SUNDAY_DELIVERY",
  TARP = "TARP",
  THIRD_PARTY_CONSIGNEE = "THIRD_PARTY_CONSIGNEE",
  TRANSMART_SERVICE_FEE = "TRANSMART_SERVICE_FEE",
  USPS = "USPS",
  WEIGHING = "WEIGHING",
}

export enum BrokerType {
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
}

export enum DaysInTransit {
  ONE_DAY = "ONE_DAY",
  TWO_DAYS = "TWO_DAYS",
  THREE_DAYS = "THREE_DAYS",
  FOUR_DAYS = "FOUR_DAYS",
  FIVE_DAYS = "FIVE_DAYS",
  SIX_DAYS = "SIX_DAYS",
  SEVEN_DAYS = "SEVEN_DAYS",
  EIGHT_DAYS = "EIGHT_DAYS",
  NINE_DAYS = "NINE_DAYS",
  TEN_DAYS = "TEN_DAYS",
  ELEVEN_DAYS = "ELEVEN_DAYS",
  TWELVE_DAYS = "TWELVE_DAYS",
  THIRTEEN_DAYS = "THIRTEEN_DAYS",
  FOURTEEN_DAYS = "FOURTEEN_DAYS",
  FIFTEEN_DAYS = "FIFTEEN_DAYS",
  SIXTEEN_DAYS = "SIXTEEN_DAYS",
  SEVENTEEN_DAYS = "SEVENTEEN_DAYS",
  EIGHTEEN_DAYS = "EIGHTEEN_DAYS",
  NINETEEN_DAYS = "NINETEEN_DAYS",
  TWENTY_DAYS = "TWENTY_DAYS",
  SMARTPOST_TRANSIT_DAYS = "SMARTPOST_TRANSIT_DAYS",
  UNKNOWN = "UNKNOWN",
}

export enum GuaranteedType {
  GUARANTEED_MORNING = "GUARANTEED_MORNING",
  GUARANTEED_CLOSE_OF_BUSINESS = "GUARANTEED_CLOSE_OF_BUSINESS",
}

export enum SmartPostIndiciaType {
  MEDIA_MAIL = "MEDIA_MAIL",
  PARCEL_RETURN = "PARCEL_RETURN",
  PARCEL_SELECT = "PARCEL_SELECT",
  PRESORTED_BOUND_PRINTED_MATTER = "PRESORTED_BOUND_PRINTED_MATTER",
  PRESORTED_STANDARD = "PRESORTED_STANDARD",
}

export interface FixedValue {
  currency: CurrencyCodes;
  amount: number;
}

export interface RateRequestControlParameters {
  returnTransitTimes?: boolean;
  servicesNeededOnRateFailure?: boolean;
  variableOptions?: VariableOption;
  rateSortOrder?: RateSortOrder;
}

export interface FedexAddress {
  city?: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

export interface SmsDetail {
  phoneNumber: string;
  phoneNumberCountryCode: string;
}

export interface EmailNotificationRecipient {
  emailAddress: string;
  notificationEventType?: NotificationEventType[];
  smsDetail?: SmsDetail;
  notificationFormatType?: NotificationFormatType;
  emailNotificationRecipientType?: EmailNotificationRecipientType;
  notificationType?: NotificationType;
  locale?: Locale;
}

export interface PrintedReference {
  printedReferenceType: PrintedReferenceType;
  value: string;
}

export interface EmailNotificationDetail {
  recipients: EmailNotificationRecipient[];
  personalMessage?: string;
  PrintedReference: PrintedReference;
}

export interface VariableHandlingChargeDetail {
  rateType?: RateType;
  percentValue?: number;
  rateLevelType?: RateLevelType;
  fixedValue?: FixedValue;
  rateElementBasis: RateElementBasis;
}

export interface DutiesPayment {
  paymentType: "SENDER" | "RECIPIENT" | "THIRD_PARTY" | "COLLECT";
  payor: {
    responsibleParty: {
      accountNumber: { value: string };
      address?: FedexAddress;
      contact?: FedexContact;
    };
  };
}

export interface Commodity {
  description: string;
  weight: FedExWeight;
  quantity: number;
  customsValue?: FixedValue;
  unitPrice?: FixedValue;
  numberOfPieces?: number;
  countryOfManufacture?: string;
  quantityUnits?: string;
  name?: string;
  harmonizedCode?: string;
  partNumber?: string;
}

export interface CustomsClearanceDetail {
  commercialInvoice?: { shipmentPurpose: ShipmentPurpose };
  freightOnValue?: FreightOnValue;
  dutiesPayment?: DutiesPayment;
  commodities: Commodity[];
}

export interface ServiceTypeDetail {
  carrierCode?: FedexCarrierCodes;
  description?: string;
  serviceName?: string;
  serviceCategory?: string;
}

export interface SmartPostInfoDetail {
  ancillaryEndorsement?: AncillaryEndorsement;
  hubId?: SmartPostHubId;
  indicia?: Indicia;
  specialServices?: SpecialService;
}

export interface ExpressFreightDetail {
  bookingConfirmationNumber?: string;
  shippersLoadAndCount?: string;
}

export interface ContentRecord {
  itemNumber?: string;
  receivedQuantity?: number;
  description?: string;
  partNumber?: string;
}

export interface VariableHandlingChargeDetail {
  rateType?: RateType;
  percentValue?: number;
  rateLevelType?: RateLevelType;
  fixedValue?: FixedValue;
  rateElementBasis: RateElementBasis;
}

export interface RequestedPackageLineItem {
  subPackagingType?: FedExSubPackagingType;
  groupPackageCount?: number;
  contentRecord?: ContentRecord[];
  declaredValue?: FixedValue;
  weight: FedExWeight;
  dimensions?: FedExDimensions;
  variableHandlingChargeDetail?: VariableHandlingChargeDetail;
  /** See FedEx documentation for details: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html */
  packageSpecialServices?: {
    specialServiceTypes: PackageSpecialService[];
    signatureOptionType: string;
  };
}

export interface Shipper {
  address: FedexAddress;
}

export interface Recipient {
  address: FedexAddress;
  contact?: FedexContact;
  accountNumber?: string;
}

export interface FedexContact {
  personName: string;
  emailAddress?: string;
  phoneNumber: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName: string;
}

export interface RequestedShipment {
  shipper: Shipper;
  recipient: Recipient;
  pickupType?: PickupType;
  requestedPackageLineItems: RequestedPackageLineItem[];
  serviceType?: FedExServiceType;
  emailNotificationDetail?: EmailNotificationDetail;
  preferredCurrency?: CurrencyCodes;
  rateRequestType: RateRequestType[];
  /**
   * This is the Shipment date. Required for future ship date rates. Default is current date if not indicated or date is in the past.
   *
   * The date format must be YYYY-MM-DDTHH:MM:SS.
   * The time must be in the format: HH:MM:SS using a 24-hour clock.
   * The date and time are separated by the letter T.
   *
   * @example '2015-03-25T09:30:00'
   */
  shipDateStamp?: string;
  documentShipment?: boolean;
  variableHandlingChargeDetail?: VariableHandlingChargeDetail;
  totalPackageCount?: number;
  totalWeight?: number;
  /** See FedEx documentation for details: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html */
  shipmentSpecialServices?: ShipmentSpecialServices;
  customsClearanceDetail?: CustomsClearanceDetail;
  groundShipment?: boolean;
  groupShipment?: boolean;
  serviceTypeDetail?: ServiceTypeDetail;
  smartPostInfoDetail?: SmartPostInfoDetail;
  expressFreightDetail?: ExpressFreightDetail;
  packagingType?: string;
}

interface ReturnShipmentDetail {
  returnType?: string;
}

interface DeliveryOnInvoiceAcceptanceDetail {
  recipient?: Recipient;
}

interface InternationalTrafficInArmsRegulationsDetail {
  licenseOrExemptionNumber: string;
}

interface ProcessingOptions {
  options: string[];
}

interface RecommendedDocumentSpecification {
  types: RecommendedDocumentSpecificationTypes[];
}

enum EmailLabelDetailOptionsRequestedOptionsEnum {
  PRODUCE_PAPERLESS_SHIPPING_FORMAT = "PRODUCE_PAPERLESS_SHIPPING_FORMAT",
  SUPPRESS_ADDITIONAL_LANGUAGES = "SUPPRESS_ADDITIONAL_LANGUAGES",
  SUPPRESS_ACCESS_EMAILS = "SUPPRESS_ACCESS_EMAILS",
}

enum EmailLabelDetailRoleEnum {
  SHIPMENT_COMPLETOR = "SHIPMENT_COMPLETOR",
  SHIPMENT_INITIATOR = "SHIPMENT_INITIATOR",
}

enum FedExLanguageCode {
  ar_AE = "ar_AE",
  bg_BG = "bg_BG",
  zh_CN = "zh_CN",
  zh_HK = "zh_HK",
  zh_TW = "zh_TW",
  cs_CZ = "cs_CZ",
  da_DK = "da_DK",
  nl_NL = "nl_NL",
  en_CA = "en_CA",
  en_GB = "en_GB",
  en_US = "en_US",
  et_EE = "et_EE",
  fi_FI = "fi_FI",
  fr_CA = "fr_CA",
  fr_FR = "fr_FR",
  de_DE = "de_DE",
  de_CH = "de_CH",
  el_GR = "el_GR",
  hu_HU = "hu_HU",
  it_IT = "it_IT",
  ja_JP = "ja_JP",
  ko_KR = "ko_KR",
  lv_LV = "lv_LV",
  lt_LT = "lt_LT",
  no_NO = "no_NO",
  pl_PL = "pl_PL",
  pt_BR = "pt_BR",
  pt_PT = "pt_PT",
  ro_RO = "ro_RO",
  ru_RU = "ru_RU",
  sk_SK = "sk_SK",
  sl_SL = "sl_SL",
  es_AR = "es_AR",
  es_MX = "es_MX",
  es_US = "es_US",
  sv_SE = "sv_SE",
  th_TH = "th_TH",
  tr_TR = "tr_TR",
  uk_UA = "uk_UA",
  vi_VN = "vi_VN",
}
interface EmailLabelDetailLocale {
  country?: FedExCountryCode;
  language?: FedExLanguageCode;
}

interface EmailLabelDetailRecipient {
  emailAddress: string;
  optionsRequested?: EmailLabelDetailOptionsRequestedOptionsEnum[];
  role?: EmailLabelDetailRoleEnum;
  locale?: EmailLabelDetailLocale;
}
interface EmailLabelDetail {
  recipients: EmailLabelDetailRecipient[];
  message: string;
}

enum DocumentReferencesDocumentTypeEnum {
  CERTIFICATE_OF_ORIGIN = "CERTIFICATE_OF_ORIGIN",
  COMMERCIAL_INVOICE = "COMMERCIAL_INVOICE",
  ETD_LABEL = "ETD_LABEL",
  NAFTA_CERTIFICATE_OF_ORIGIN = "NAFTA_CERTIFICATE_OF_ORIGIN",
  NET_RATE_SHEET = "NET_RATE_SHEET",
  OTHER = "OTHER",
  PRO_FORMA_INVOICE = "PRO_FORMA_INVOICE",
}
interface DocumentReference {
  documentType?: DocumentReferencesDocumentTypeEnum;
  customerReference?: string;
  description?: string;
  documentId?: string;
}

interface ShipmentDryIceDetail {
  totalWeight?: FedExWeight;
  packageCount: number;
}
interface PendingShipmentDetail {
  pendingShipmentType?: string;
  processingOptions?: ProcessingOptions;
  recommendedDocumentSpecification?: RecommendedDocumentSpecification;
  emailLabelDetail?: EmailLabelDetail[];
  documentReferences?: DocumentReference[];
  /**
   * Specify the Email Return Label expiration date. The Maximum expiration date for an Email Return Label must
   * be greater or equal to the day of the label request and not greater than 2 years in the future.
   * Example: 2012-12-31.
   */
  expirationTimeStamp?: string;
  shipmentDryIceDetail?: ShipmentDryIceDetail;
}

interface LocationContactAndAddress {
  contact?: FedexContact;
  address?: FedexAddress;
}

enum HoldAtLocationDetailLocationTypeEnum {
  FEDEX_AUTHORIZED_SHIP_CENTER = "FEDEX_AUTHORIZED_SHIP_CENTER",
  FEDEX_OFFICE = "FEDEX_OFFICE",
  FEDEX_SELF_SERVICE_LOCATION = "FEDEX_SELF_SERVICE_LOCATION",
  FEDEX_STAFFED = "FEDEX_STAFFED",
  RETAIL_ALLICANCE_LOCATION = "RETAIL_ALLICANCE_LOCATION",
  FEDEX_GROUND_TERMINAL = "FEDEX_GROUND_TERMINAL",
  FEDEX_ONSITE = "FEDEX_ONSITE",
}
interface HoldAtLocationDetail {
  locationId: string;
  locationContactAndAddress?: LocationContactAndAddress;
  locationType?: HoldAtLocationDetailLocationTypeEnum;
}

enum ChargeTotalTypeEnum {
  CURRENT_PACKAGE = "CURRENT_PACKAGE",
  SUM_OF_PACKAGES = "SUM_OF_PACKAGES",
}

enum ChargeTypeEnum {
  COD_SURCHARGE = "COD_SURCHARGE",
  NET_CHARGE = "NET_CHARGE",
  NET_FREIGHT = "NET_FREIGHT",
  TOTAL_CUSTOMER_CHARGE = "TOTAL_CUSTOMER_CHARGE",
}
interface AddTransportationChargesDetail {
  rateType?: RateType;
  rateLevelType?: RateLevelType;
  chargeTotalType?: ChargeTotalTypeEnum;
  chargeType?: ChargeTypeEnum;
}

interface CodRecipient {
  address?: FedexAddress;
  contact?: FedexContact;
  accountNumber?: {
    value: string;
  };
}

enum CodCollectionTypeEnum {
  ANY = "ANY",
  CASH = "CASH",
  COMPANY_CHECK = "COMPANY_CHECK",
  GUARANTEED_FUNDS = "GUARANTEED_FUNDS",
  PERSONAL_CHECK = "PERSONAL_CHECK",
}

interface FinancialInstitutionContactAndAddress {
  contact: FedexContact;
  address: FedexAddress;
}

enum ReturnReferenceIndicatorTypeEnum {
  INVOICE = "INVOICE",
  PO = "PO",
  REFERENCE = "REFERENCE",
  TRACKING = "TRACKING",
}

interface ShipmentCODDetail {
  addTransportationChargesDetail?: AddTransportationChargesDetail;
  codRecipient?: CodRecipient;
  remitToName?: string;
  codCollectionType?: CodCollectionTypeEnum;
  financialInstitutionContactAndAddress?: FinancialInstitutionContactAndAddress;
  returnReferenceIndicatorType?: ReturnReferenceIndicatorTypeEnum;
}

enum InternationalControlledExportDetailEnum {
  DEA_036 = "DEA_036",
  DEA_236 = "DEA_236",
  DEA_486 = "DEA_486",
  DSP_05 = "DSP_05",
  DSP_61 = "DSP_61",
  DSP_73 = "DSP_73",
  DSP_85 = "DSP_85",
  DSP_94 = "DSP_94",
  DSP_LICENSE_AGREEMENT = "DSP_LICENSE_AGREEMENT",
  FROM_FOREIGN_TRADE_ZONE = "FROM_FOREIGN_TRADE_ZONE",
  WAREHOUSE_WITHDRAWAL = "WAREHOUSE_WITHDRAWAL",
}
interface InternationalControlledExportDetail {
  type: InternationalControlledExportDetailEnum;
}

interface FedexPhoneNumber {
  areaCode?: string;
  extension?: string;
  countryCode?: FedExCountryCode;
  personalIdentificationNumber?: string;
  localNumber?: string;
}

enum HomeDeliveryPremiumTypeEnum {
  APPOINTMENT = "APPOINTMENT",
  DATE_CERTAIN = "DATE_CERTAIN",
  EVENING = "EVENING",
}
interface HomeDeliveryPremiumDetail {
  phoneNumber?: FedexPhoneNumber;
  /**
   * This is shipment date. Both the date and time portions of the string are expected to be used.
   * The date should not be a past date or a date more than 10 days in the future.
   * The time is the local time of the shipment based on the shipper's time zone.
   * Format: YYYY-MM-DD.
   * Example: 2019-06-26.
   */
  shipTimestamp?: string;
  homedeliveryPremiumType?: HomeDeliveryPremiumTypeEnum;
}

export interface ShipmentSpecialServices {
  returnShipmentDetail?: ReturnShipmentDetail;
  deliveryOnInvoiceAcceptanceDetail?: DeliveryOnInvoiceAcceptanceDetail;
  internationalTrafficInArmsRegulationsDetail?: InternationalTrafficInArmsRegulationsDetail;
  pendingShipmentDetail?: PendingShipmentDetail;
  holdAtLocationDetail?: HoldAtLocationDetail;
  shipmentCODDetail?: ShipmentCODDetail;
  shipmentDryIceDetail?: ShipmentDryIceDetail;
  internationalControlledExportDetail?: InternationalControlledExportDetail;
  homeDeliveryPremiumDetail?: HomeDeliveryPremiumDetail;
  specialServiceTypes?: SpecialServiceType[];
}

export interface FedexBody {
  accountNumber?: { value: string };
  carrierCodes?: FedexCarrierCodes[];
  rateRequestControlParameters?: RateRequestControlParameters;
  requestedShipment: RequestedShipment;
}

export interface GetRatesAndTransitTimesData {
  body: FedexBody;
}

export interface Alert {
  code: string;
  alertType: AlertType;
  message: string;
}

export interface CustomerMessage {
  message: string;
  code: string;
}

export interface VariableHandlingCharge {
  totalCustomerCharge: number;
  variableHandlingCharge: number;
}

export interface EdtTaxDetail {
  edtTaxType: string;
  amount: number;
  taxableValue: number;
  name: string;
  description: string;
  formula: string;
  effectiveDate: string;
}

export interface EdtCharge {
  alternateHarmonizedCodes: string[];
  edtTaxDetail: EdtTaxDetail;
  harmonizedCode: string;
}

export interface Surcharge {
  type: SurchargeType;
  description: string;
  amount: number;
  level: string;
  name: string;
}

export interface Discount {
  amount: number;
  description: string;
  name: string;
  percent: number;
  type: string;
}

export interface PackageRateDetail {
  ratedWeightMethod: RatedWeightMethod;
  totalTaxes: number;
  totalFreightDiscounts: number;
  baseCharge: number;
  totalRebates: number;
  rateType: RateType;
  billingWeight: FedExWeight;
  netFreight: number;
  surcharges: Surcharge[];
  totalSurcharges: number;
  netFedExCharge: number;
  netCharge: number;
  freightDiscounts: Discount[];
}

export interface RatedPackage {
  effectiveNetDiscount: number;
  groupNumber: number;
  packageRateDetail: PackageRateDetail;
}

export interface Tax {
  amount: number;
  description: string;
  name: string;
  type: string;
}

export interface CurrencyExchangeRate {
  fromCurrency: CurrencyCodes;
  toCurrency: CurrencyCodes;
  rate: number;
}

export interface ShipmentLegRateDetail {
  discounts: Discount[];
  pricingCode: string;
  legDescription: string;
  surcharges: Surcharge[];
  specialRatingApplied: string[];
  taxes: Tax[];
  rateScale: string;
  totalNetCharge: number;
  totalBaseCharge: number;
  currencyExchangeRate: CurrencyExchangeRate;
  totalBillingWeight: FedExWeight;
  currency: CurrencyCodes;
}

export interface TotalVariableHandlingCharges {
  totalCustomerCharge: number;
  variableHandlingCharge: number;
}

export interface AncillaryFeeAndTax {
  amount: number;
  description: string;
  type: string;
}

export interface ShipmentRateDetail {
  currencyExchangeRate: CurrencyExchangeRate;
  currency: CurrencyCodes;
  rateZone: string;
  pricingCode: string;
  totalFreightDiscount: number;
  specialRatingApplied: string[];
  totalSurcharges: number;
  freightDiscount: Discount[];
  fuelSurchargePercent: number;
  totalBillingWeight: FedExWeight;
  totalDimWeight: number;
  dimDivisor: number;
  surcharges: Surcharge[];
}

export interface RatedShipmentDetails {
  rateType: RateType;
  ratedWeightMethod: RatedWeightMethod;
  totalDutiesTaxesAndFees: number;
  totalDiscounts: number;
  totalDutiesAndTaxes: number;
  variableHandlingCharges: VariableHandlingCharge;
  edtCharges: EdtCharge[];
  totalAncillaryFeesAndTaxes: number;
  totalNetFedExCharge: number;
  quoteNumber: string;
  freightChargeBasis: FreightChargeBasis;
  totalVatCharge: number;
  totalNetCharge: number;
  totalBaseCharge: number;
  totalNetChargeWithDutiesAndTaxes: number;
  ratedPackages: RatedPackage[];
  shipmentLegRateDetails: ShipmentLegRateDetail[];
  totalVariableHandlingCharges: TotalVariableHandlingCharges;
  ancillaryFeesAndTaxes: AncillaryFeeAndTax[];
  preferredEdtCharges: EdtCharge[];
  shipmentRateDetail: ShipmentRateDetail;
}

export interface OperationalDetail {
  originLocationIds: string[];
  commitDays: string[];
  serviceCode: string;
  airportId: string;
  scac: string;
  originServiceAreas: string[];
  deliveryDay: string;
  originLocationNumbers: number[];
  destinationPostalCode: string;
  commitDate: string;
  astraDescription: string;
  deliveryDate: string;
  deliveryEligibilities: string[];
  ineligibleForMoneyBackGuarantee: boolean;
  MaximumTransitTime: string;
  astraPlannedServiceLevel: string;
  destinationLocationIds: string[];
  destinationLocationStateOrProvinceCodes: string[];
  transitTime: string;
  packagingCode: string;
  destinationLocationNumbers: number[];
  publishedDeliveryTime: string;
  countryCodes: string[];
  stateOrProvinceCodes: string[];
  ursaPrefixCode: string;
  ursaSuffixCode: string;
  destinationServiceAreas: string[];
  originPostalCodes: string[];
  customTransitTime: string;
}

export interface Name {
  type: string;
  encoding: string;
  value: string;
}

export interface ServiceDescription {
  serviceType: FedExServiceType;
  code: string;
  names: Name[];
  operatingOrgCodes: string[];
  astraDescription: string;
  description: string;
  serviceId: string;
  serviceCategory: string;
}

export interface Broker {
  accountNumber: {
    value: string;
  };
  contact: FedexContact;
  address: FedexAddress;
}

export interface FedexAdvancedAddress {
  streetLines: string[];
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
  residential: boolean;
  classification: string;
  geographicCoordinates: string;
  urbanizationCode: string;
  countryName: string;
}

export interface BrokerDetail {
  broker: Broker;
  type: BrokerType;
  brokerCommitTimestamp: string;
  brokerCommitDayOfWeek: string;
  brokerLocationId: string;
  brokerAddress: FedexAdvancedAddress;
  brokerToDestinationDays: number;
}

export interface DateDetail {
  dayOfWeek: string;
  dayFormat: string;
}

export interface TransitDays {
  description: string;
  minimumTransitTime: DaysInTransit;
  maximumTransitTime: string;
}

export interface Commit {
  daysInTransit: DaysInTransit;
  guaranteedType: GuaranteedType;
  dateDetail: DateDetail;
  saturdayDelivery: boolean;
  alternativeCommodityNames: string[];
  smartPostCommitTime: string;
  transitDays: TransitDays;
  label: string;
  commitMessageDetails: string;
  commodityName: string;
}

export interface ServiceSubOptionDetail {
  smartPostIndiciaType: SmartPostIndiciaType;
}

export interface RateReplyDetail {
  serviceType: FedExServiceType;
  serviceName: string;
  packagingType: FedExPackageType;
  customerMessages: CustomerMessage[];
  ratedShipmentDetails: RatedShipmentDetails[];
  operationalDetail: OperationalDetail;
  signatureOptionType: string;
  serviceDescription: ServiceDescription;
  brokerDetail: BrokerDetail;
  commit: Commit;
  serviceSubOptionDetail: ServiceSubOptionDetail;
}

export type GetRatesAndTransitTimesResponse =
  FedExResponse<GetRatesAndTransitTimesOutput>;

interface GetRatesAndTransitTimesOutput {
  quoteDate: string;
  encoded: boolean;
  rateReplyDetails: RateReplyDetail[];
}

export enum FedExCountryCode {
  AF = "AF",
  AL = "AL",
  DZ = "DZ",
  AS = "AS",
  AD = "AD",
  AO = "AO",
  AI = "AI",
  AQ = "AQ",
  AG = "AG",
  AR = "AR",
  AM = "AM",
  AW = "AW",
  AU = "AU",
  AT = "AT",
  AZ = "AZ",
  BS = "BS",
  BH = "BH",
  BD = "BD",
  BB = "BB",
  BY = "BY",
  BE = "BE",
  BZ = "BZ",
  BJ = "BJ",
  BM = "BM",
  BT = "BT",
  BO = "BO",
  BQ = "BQ",
  BA = "BA",
  BW = "BW",
  BV = "BV",
  BR = "BR",
  IO = "IO",
  BN = "BN",
  BG = "BG",
  BF = "BF",
  BI = "BI",
  KH = "KH",
  CM = "CM",
  CA = "CA",
  CV = "CV",
  CF = "CF",
  TD = "TD",
  CL = "CL",
  CN = "CN",
  CX = "CX",
  CC = "CC",
  CO = "CO",
  KM = "KM",
  CG = "CG",
  CD = "CD",
  CK = "CK",
  CR = "CR",
  HR = "HR",
  CU = "CU",
  CW = "CW",
  CY = "CY",
  CZ = "CZ",
  DK = "DK",
  DJ = "DJ",
  DM = "DM",
  DO = "DO",
  TL = "TL",
  EC = "EC",
  EG = "EG",
  SV = "SV",
  GB = "GB",
  GQ = "GQ",
  ER = "ER",
  EE = "EE",
  SZ = "SZ",
  ET = "ET",
  FO = "FO",
  FK = "FK",
  FJ = "FJ",
  FI = "FI",
  FR = "FR",
  GF = "GF",
  TF = "TF",
  GA = "GA",
  GM = "GM",
  GE = "GE",
  DE = "DE",
  GH = "GH",
  GI = "GI",
  KY = "KY",
  VG = "VG",
  GR = "GR",
  GL = "GL",
  GD = "GD",
  GP = "GP",
  GU = "GU",
  GT = "GT",
  GN = "GN",
  GW = "GW",
  GY = "GY",
  HT = "HT",
  HM = "HM",
  HN = "HN",
  HK = "HK",
  HU = "HU",
  IS = "IS",
  IN = "IN",
  ID = "ID",
  IR = "IR",
  IQ = "IQ",
  IE = "IE",
  IL = "IL",
  IT = "IT",
  CI = "CI",
  JM = "JM",
  JP = "JP",
  JO = "JO",
  KZ = "KZ",
  KE = "KE",
  KI = "KI",
  KW = "KW",
  KG = "KG",
  LA = "LA",
  LV = "LV",
  LB = "LB",
  LS = "LS",
  LR = "LR",
  LY = "LY",
  LI = "LI",
  LT = "LT",
  LU = "LU",
  MO = "MO",
  MK = "MK",
  MG = "MG",
  MW = "MW",
  MY = "MY",
  MV = "MV",
  ML = "ML",
  MT = "MT",
  MH = "MH",
  MQ = "MQ",
  MR = "MR",
  MU = "MU",
  YT = "YT",
  MX = "MX",
  FM = "FM",
  MD = "MD",
  MC = "MC",
  MN = "MN",
  ME = "ME",
  MS = "MS",
  MA = "MA",
  MZ = "MZ",
  MM = "MM",
  NA = "NA",
  NR = "NR",
  NP = "NP",
  NL = "NL",
  NC = "NC",
  NZ = "NZ",
  NI = "NI",
  NE = "NE",
  NG = "NG",
  NU = "NU",
  NF = "NF",
  KP = "KP",
  MP = "MP",
  NO = "NO",
  OM = "OM",
  PK = "PK",
  PW = "PW",
  PS = "PS",
  PA = "PA",
  PG = "PG",
  PY = "PY",
  PE = "PE",
  PH = "PH",
  PN = "PN",
  PL = "PL",
  PT = "PT",
  PR = "PR",
  QA = "QA",
  RE = "RE",
  RO = "RO",
  RU = "RU",
  RW = "RW",
  WS = "WS",
  ST = "ST",
  SA = "SA",
  SN = "SN",
  RS = "RS",
  SC = "SC",
  SL = "SL",
  SG = "SG",
  SK = "SK",
  SI = "SI",
  SB = "SB",
  SO = "SO",
  ZA = "ZA",
  GS = "GS",
  KR = "KR",
  ES = "ES",
  LK = "LK",
  BL = "BL",
  KN = "KN",
  VI = "VI",
  SH = "SH",
  LC = "LC",
  SX = "SX",
  MF = "MF",
  PM = "PM",
  VC = "VC",
  SD = "SD",
  SR = "SR",
  SJ = "SJ",
  SE = "SE",
  CH = "CH",
  SY = "SY",
  PF = "PF",
  TW = "TW",
  TJ = "TJ",
  TZ = "TZ",
  TH = "TH",
  TG = "TG",
  TK = "TK",
  TO = "TO",
  TT = "TT",
  TN = "TN",
  TR = "TR",
  TM = "TM",
  TC = "TC",
  TV = "TV",
  UM = "UM",
  UG = "UG",
  UA = "UA",
  AE = "AE",
  US = "US",
  UY = "UY",
  UZ = "UZ",
  VU = "VU",
  VE = "VE",
  VN = "VN",
  WF = "WF",
  EH = "EH",
  YE = "YE",
  ZM = "ZM",
  ZW = "ZW",
}

enum RecommendedDocumentSpecificationTypes {
  ANTIQUE_STATEMENT_EUROPEAN_UNION = "ANTIQUE_STATEMENT_EUROPEAN_UNION",
  ANTIQUE_STATEMENT_UNITED_STATES = "ANTIQUE_STATEMENT_UNITED_STATES",
  ASSEMBLER_DECLARATION = "ASSEMBLER_DECLARATION",
  BEARING_WORKSHEET = "BEARING_WORKSHEET",
  CERTIFICATE_OF_SHIPMENTS_TO_SYRIA = "CERTIFICATE_OF_SHIPMENTS_TO_SYRIA",
  COMMERCIAL_INVOICE_FOR_THE_CARIBBEAN_COMMON_MARKET = "COMMERCIAL_INVOICE_FOR_THE_CARIBBEAN_COMMON_MARKET",
  CONIFEROUS_SOLID_WOOD_PACKAGING_MATERIAL_TO_THE_PEOPLES_REPUBLIC_OF_CHINA = "CONIFEROUS_SOLID_WOOD_PACKAGING_MATERIAL_TO_THE_PEOPLES_REPUBLIC_OF_CHINA",
  DECLARATION_FOR_FREE_ENTRY_OF_RETURNED_AMERICAN_PRODUCTS = "DECLARATION_FOR_FREE_ENTRY_OF_RETURNED_AMERICAN_PRODUCTS",
  DECLARATION_OF_BIOLOGICAL_STANDARDS = "DECLARATION_OF_BIOLOGICAL_STANDARDS",
  DECLARATION_OF_IMPORTED_ELECTRONIC_PRODUCTS_SUBJECT_TO_RADIATION_CONTROL_STANDARD = "DECLARATION_OF_IMPORTED_ELECTRONIC_PRODUCTS_SUBJECT_TO_RADIATION_CONTROL_STANDARD",
  ELECTRONIC_INTEGRATED_CIRCUIT_WORKSHEET = "ELECTRONIC_INTEGRATED_CIRCUIT_WORKSHEET",
  FILM_AND_VIDEO_CERTIFICATE = "FILM_AND_VIDEO_CERTIFICATE",
  INTERIM_FOOTWEAR_INVOICE = "INTERIM_FOOTWEAR_INVOICE",
  NAFTA_CERTIFICATE_OF_ORIGIN_CANADA_ENGLISH = "NAFTA_CERTIFICATE_OF_ORIGIN_CANADA_ENGLISH",
  NAFTA_CERTIFICATE_OF_ORIGIN_CANADA_FRENCH = "NAFTA_CERTIFICATE_OF_ORIGIN_CANADA_FRENCH",
  NAFTA_CERTIFICATE_OF_ORIGIN_SPANISH = "NAFTA_CERTIFICATE_OF_ORIGIN_SPANISH",
  NAFTA_CERTIFICATE_OF_ORIGIN_UNITED_STATES = "NAFTA_CERTIFICATE_OF_ORIGIN_UNITED_STATES",
  PACKING_LIST = "PACKING_LIST",
  PRINTED_CIRCUIT_BOARD_WORKSHEET = "PRINTED_CIRCUIT_BOARD_WORKSHEET",
  REPAIRED_WATCH_BREAKOUT_WORKSHEET = "REPAIRED_WATCH_BREAKOUT_WORKSHEET",
  STATEMENT_REGARDING_THE_IMPORT_OF_RADIO_FREQUENCY_DEVICES = "STATEMENT_REGARDING_THE_IMPORT_OF_RADIO_FREQUENCY_DEVICES",
  TOXIC_SUBSTANCES_CONTROL_ACT = "TOXIC_SUBSTANCES_CONTROL_ACT",
  UNITED_STATES_CARIBBEAN_BASIN_TRADE_PARTNERSHIP_ACT_CERTIFICATE_OF_ORIGIN_TEXTILES = "UNITED_STATES_CARIBBEAN_BASIN_TRADE_PARTNERSHIP_ACT_CERTIFICATE_OF_ORIGIN_TEXTILES",
  UNITED_STATES_CARIBBEAN_BASIN_TRADE_PARTNERSHIP_ACT_CERTIFICATE_OF_ORIGIN_NON_TEXTILES = "UNITED_STATES_CARIBBEAN_BASIN_TRADE_PARTNERSHIP_ACT_CERTIFICATE_OF_ORIGIN_NON_TEXTILES",
  UNITED_STATES_NEW_WATCH_WORKSHEET = "UNITED_STATES_NEW_WATCH_WORKSHEET",
  UNITED_STATES_WATCH_REPAIR_DECLARATIO = "UNITED_STATES_WATCH_REPAIR_DECLARATION",
}

enum SpecialServiceType {
  /**FedEx Appointment Home Delivery®*/
  APPOINTMENT,
  /**Broker Select Option*/
  BROKER_SELECT_OPTION,
  /** Call Before Delivery*/
  CALL_BEFORE_DELIVERY,
  COD, //Collect on Delivery(COD)
  CUSTOM_DELIVERY_WINDOW, //Custom Delivery Window
  CUT_FLOWERS, //Cut Flowers
  DO_NOT_BREAK_DOWN_PALLETS, //Do Not Break Down Pallets
  DO_NOT_STACK_PALLETS, //Do Not Stack Pallets
  DRY_ICE, //Dry Ice
  EAST_COAST_SPECIAL, //East Coast Special Service
  EXCLUDE_FROM_CONSOLIDATION, //Exclude From Consolidation
  EXTREME_LENGTH, //Extreme Length
  INSIDE_DELIVERY, //FedEx Inside Delivery
  INSIDE_PICKUP, //FedEx Inside Pickup
  INTERNATIONAL_CONTROLLED_EXPORT_SERVICE, //FedEx International Controlled Export
  FEDEX_ONE_RATE, //FedEx One Rate®
  THIRD_PARTY_CONSIGNEE, //FedEx Third Party Consignee International Priority service (TPC)
  ELECTRONIC_TRADE_DOCUMENTS, //FedEx® Electronic Trade Documents
  FOOD, //Food
  FUTURE_DAY_SHIPMENT, //Future Day Shipment
  HOLD_AT_LOCATION, //Hold At Location
  INTERNATIONAL_TRAFFIC_IN_ARMS_REGULATIONS, //International Traffic in Arms Regulations(ITAR)
  LIFTGATE_DELIVERY, //LiftGate Delivery
  LIFTGATE_PICKUP, //LiftGate Pickup
  LIMITED_ACCESS_DELIVERY, //Limited Access Delivery
  LIMITED_ACCESS_PICKUP, //Limited Access Pickup
  OVER_LENGTH, //Over Length
  PENDING_SHIPMENT, //Pending Shipment
  PHARMACY_DELIVERY, //Pharmacy Delivery
  POISON, //Poison
  HOME_DELIVERY_PREMIUM, //Premium Home Delivery
  PROTECTION_FROM_FREEZING, //Protection From Freezing
  RETURNS_CLEARANCE, //Return Clearance
  RETURN_SHIPMENT, //Return Shipment
  SATURDAY_DELIVERY, //Saturday Delivery
  SATURDAY_PICKUP, //Saturday Pickup
  EVENT_NOTIFICATION, //Shipment Event Notification
  DELIVERY_ON_INVOICE_ACCEPTANCE, //Delivery on Invoice Acceptance
  TOP_LOAD, //Top Load
  FREIGHT_GUARANTEE, //Freight Guarantee
}
