export interface UspsTotalRatesQuery {
  originZIPCode: string;
  destinationZIPCode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  mailingDate?: string;
  priceType: "RETAIL" | "COMMERCIAL" | "CONTRACT" | "NSA";
  accountType?: "EPS" | "PERMIT" | "METER" | "MID";
  accountNumber?: string;
  mailClass?: string;
  mailClasses?: string[];
  processingCategory?: string;
  rateIndicator?: string;
  destinationEntryFacilityType?: string;
  hasNonstandardCharacteristics?: boolean;
  extraServices?: number[];
  itemValue?: number;
}

export interface UspsBaseRatesListQuery {
  originZIPCode: string;
  destinationZIPCode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  mailingDate?: string;
  priceType: "RETAIL" | "COMMERCIAL" | "CONTRACT" | "NSA";
  accountType?: "EPS" | "PERMIT" | "METER" | "MID";
  accountNumber?: string;
  mailClass?: string;
  mailClasses?: string[];
  hasNonstandardCharacteristics?: boolean;
}

export interface UspsTotalRatesResult {
  rateOptions: UspsRateOption[];
}

export interface UspsRateOption {
  totalBasePrice: number;
  totalPrice?: number;
  rates: UspsRateDetail[];
  extraServices?: UspsExtraServiceDetail[];
}

export interface UspsRateDetail {
  SKU: string;
  description: string;
  priceType: "RETAIL" | "COMMERCIAL" | "CONTRACT" | "NSA";
  price: number;
  weight: number;
  dimWeight?: number;
  fees: UspsRateFee[];
  startDate?: string;
  endDate?: string | null;
  mailClass: string;
  zone?: string;
  productName: string;
  productDefinition: string;
  processingCategory?: string;
  rateIndicator?: string;
  destinationEntryFacilityType?: string;
  warnings?: UspsRateWarning[];
}

export interface UspsRateFee {
  name: string;
  SKU: string;
  price: number;
}

export interface UspsExtraServiceDetail {
  extraService: string;
  name: string;
  SKU: string;
  priceType: "RETAIL" | "COMMERCIAL" | "CONTRACT" | "NSA";
  price: number;
  warnings?: UspsRateWarning[];
}

export interface UspsRateWarning {
  warningCode: string;
  warningDescription: string;
}

export interface UspsBaseRatesListResult {
  rateOptions: UspsRateOption[];
}
