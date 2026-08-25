import { CAPagingQueryOptions, CAQueryOptions } from "../types.js";

export type GetProfilesDetailsOptions = CAPagingQueryOptions<keyof Profile>;

export type GetProfileDetailsOptions = CAQueryOptions<keyof Profile>;

export interface Profile {
  ID: number;
  AccountName: string;
  CompanyName: string;
  CurrencyCode: string;
  TimeZoneRegion: string;
  TimeZoneDescription: string;
  DefaultDistributionCenterID: number;
}
