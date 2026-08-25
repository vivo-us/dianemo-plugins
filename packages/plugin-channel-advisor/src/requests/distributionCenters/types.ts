import { CAPagingQueryOptions, CAQueryOptions } from "../types.js";

export type DistributionCenterExpandOptions = "OperatingHours";

export type DistributionCenterExpand = {
  options?: DistributionCenterExpandOptions[];
};

export type GetDistributionCentersOptions = CAPagingQueryOptions<
  keyof GetDistributionCenter,
  DistributionCenterExpand
>;

export type GetDistributionCenterOptions = CAQueryOptions<
  keyof GetDistributionCenter,
  DistributionCenterExpand
>;

export type TimeZone =
  | "Pacific/Pago_Pago"
  | "Pacific/Honolulu"
  | "America/Anchorage"
  | "America/Los_Angeles"
  | "America/Tijuana"
  | "America/Vancouver"
  | "America/Denver"
  | "America/Edmonton"
  | "America/Mazatlan"
  | "America/Phoenix"
  | "America/Belize"
  | "America/Chicago"
  | "America/Costa_Rica"
  | "America/El_Salvador"
  | "America/Guatemala"
  | "America/Mexico_City"
  | "America/Regina"
  | "America/Winnipeg"
  | "Pacific/Easter"
  | "America/Bogota"
  | "America/Cancun"
  | "America/Havana"
  | "America/Lima"
  | "America/New_York"
  | "America/Panama"
  | "America/Toronto"
  | "America/Caracas"
  | "America/Halifax"
  | "America/La_Paz"
  | "America/Santiago"
  | "America/St_Johns"
  | "America/Argentina/Buenos_Aires"
  | "America/Sao_Paulo"
  | "Atlantic/South_Georgia"
  | "Atlantic/Cape_Verde"
  | "Africa/Casablanca"
  | "Europe/Dublin"
  | "Europe/Lisbon"
  | "Europe/London"
  | "Africa/Algiers"
  | "Africa/Windhoek"
  | "Europe/Budapest"
  | "Europe/Copenhagen"
  | "Europe/Rome"
  | "Europe/Belgrade"
  | "Africa/Cairo"
  | "Africa/Johannesburg"
  | "Africa/Maputo"
  | "Africa/Tripoli"
  | "Asia/Jerusalem"
  | "Europe/Athens"
  | "Europe/Bucharest"
  | "Europe/Helsinki"
  | "Africa/Nairobi"
  | "Europe/Istanbul"
  | "Europe/Moscow"
  | "Asia/Tehran"
  | "Asia/Dubai"
  | "Asia/Tbilisi"
  | "Asia/Kabul"
  | "Asia/Karachi"
  | "Asia/Yekaterinburg"
  | "Asia/Colombo"
  | "Asia/Kolkata"
  | "Asia/Kathmandu"
  | "Asia/Dhaka"
  | "Asia/Yangon"
  | "Asia/Bangkok"
  | "Asia/Ho_Chi_Minh"
  | "Asia/Jakarta"
  | "Asia/Hong_Kong"
  | "Asia/Shanghai"
  | "Asia/Singapore"
  | "Asia/Taipei"
  | "Australia/Perth"
  | "Australia/Eucla"
  | "Asia/Seoul"
  | "Asia/Tokyo"
  | "Asia/Yakutsk"
  | "Australia/Adelaide"
  | "Australia/Darwin"
  | "Asia/Vladivostok"
  | "Australia/Brisbane"
  | "Australia/Hobart"
  | "Australia/Melbourne"
  | "Pacific/Guam"
  | "Asia/Magadan"
  | "Pacific/Auckland"
  | "Pacific/Fiji"
  | "Pacific/Kwajalein"
  | "Pacific/Tongatapu";

export enum ThroughputLimitUnit {
  Minutes = 1,
  Hours = 2,
  Days = 3,
}

export enum DistributionCenterType {
  Warehouse = 0,
  ExternallyManaged = 1,
  DropShip = 2,
  RetailStore = 3,
}

export enum Day {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface GetDistributionCenter {
  ID: number;
  Name: string;
  Code: string;
  FulfillmentPartnerName: string;
  ContactName: string;
  ContactEmail: string;
  ContactPhone: string;
  Address1: string;
  Address2: string;
  City: string;
  StateOrProvince: string;
  County: string;
  District: string;
  Country: string;
  PostalCode: string;
  TimeZone: TimeZone;
  PickupLocation: boolean;
  ShipLocation: boolean;
  DeliveryAvailable: boolean;
  HandlingTimeMinutes: number;
  ThroughputLimitNumber: number;
  ThroughputLimitUnits: ThroughputLimitUnit;
  PickupOrderHoldMinutes: number;
  Type: DistributionCenterType;
  IsExternallyManaged: boolean;
  IsDeleted: boolean;
  DeletedDateUtc: string;
  MainPhone: string;
  AltPhone: string;
  Fax: string;
  Email: string;
  HomePage: string;
  Latitude: number;
  Longitude: number;
  BusinessDescription: string;
  StoreCategories: string;
  CourierPickupInstructions: string;
  CustomerPickupInstructions: string;
  PickupInstructions: string;
  OperatingHours?: GetOperatingHours[];
}

export interface CreateDistributionCenter {
  Name: string;
  Code: string;
  ContactName?: string;
  ContactEmail?: string;
  ContactPhone?: string;
  Address1: string;
  Address2?: string;
  City: string;
  StateOrProvince: string;
  County?: string;
  District?: string;
  Country: string;
  PostalCode: string;
  TimeZone?: TimeZone;
  DeliveryAvailable?: boolean;
  HandlingTimeMinutes?: number;
  ThroughputLimitNumber?: number;
  ThroughputLimitUnits?: ThroughputLimitUnit;
  PickupOrderHoldMinutes?: number;
  Type: DistributionCenterType;
  MainPhone?: string;
  AltPhone?: string;
  Fax?: string;
  Email?: string;
  HomePage?: string;
  Latitude?: number;
  Longitude?: number;
  BusinessDescription?: string;
  StoreCategories?: string;
  CourierPickupInstructions?: string;
  CustomerPickupInstructions?: string;
  PickupInstructions?: string;
  OperatingHours?: UpdateOperatingHours[];
}

export interface UpdateDistributionCenter {
  Name?: string;
  ContactName?: string;
  ContactEmail?: string;
  ContactPhone?: string;
  Address1?: string;
  Address2?: string;
  City?: string;
  StateOrProvince?: string;
  County?: string;
  District?: string;
  Country?: string;
  PostalCode?: string;
  TimeZone?: TimeZone;
  DeliveryAvailable?: boolean;
  HandlingTimeMinutes?: number;
  ThroughputLimitNumber?: number;
  ThroughputLimitUnits?: ThroughputLimitUnit;
  PickupOrderHoldMinutes?: number;
  DistributionCenterType?: DistributionCenterType;
  MainPhone?: string;
  AltPhone?: string;
  Fax?: string;
  Email?: string;
  HomePage?: string;
  Latitude?: number;
  Longitude?: number;
  BusinessDescription?: string;
  StoreCategories?: string;
  CourierPickupInstructions?: string;
  CustomerPickupInstructions?: string;
  PickupInstructions?: string;
  OperatingHours?: UpdateOperatingHours[];
}

export interface GetOperatingHours {
  DistributionCenterID: number;
  DayID: Day;
  OpenTime: string;
  CloseTime: string;
}

export interface UpdateOperatingHours {
  DayID: Day;
  OpenTime: string;
  CloseTime: string;
}
