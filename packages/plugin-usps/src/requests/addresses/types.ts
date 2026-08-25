export interface UspsValidateAddressParams {
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  state: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  urbanization?: string;
  firm?: string;
}

export interface UspsAddressResponse {
  firm?: string;
  address: UspsDomesticAddress;
  additionalInfo?: UspsAddressAdditionalInfo;
  corrections?: UspsAddressCorrection[];
  matches?: UspsAddressMatch[];
  warnings?: string[];
}

export interface UspsDomesticAddress {
  streetAddress: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  city: string;
  cityAbbreviation?: string;
  state: string;
  ZIPCode: string;
  ZIPPlus4?: string | null;
  urbanization?: string;
}

export interface UspsAddressAdditionalInfo {
  deliveryPoint?: string;
  carrierRoute?: string;
  DPVConfirmation?: "Y" | "D" | "S" | "N";
  DPVCMRA?: "Y" | "N";
  business?: "Y" | "N";
  centralDeliveryPoint?: "Y" | "N";
  vacant?: "Y" | "N";
}

export interface UspsAddressCorrection {
  code: string;
  text: string;
}

export interface UspsAddressMatch {
  code: string;
  text: string;
}
