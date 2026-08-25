export interface UspsAddress {
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  urbanization?: string;
}

export interface UspsLabelAddress extends UspsAddress {
  firstName?: string;
  lastName?: string;
  firm?: string;
  phone?: string;
  email?: string;
  ignoreBadAddress?: boolean;
}

export interface UspsLabelToAddress extends UspsLabelAddress {
  parcelLockerDelivery?: boolean;
  holdForPickup?: boolean;
  facilityId?: string;
}

export interface UspsImageInfo {
  imageType?:
    | "PDF"
    | "TIFF"
    | "JPG"
    | "PNG"
    | "GIF"
    | "SVG"
    | "ZPL203DPI"
    | "ZPL300DPI"
    | "LABEL_BROKER"
    | "NONE";
  labelType?: "4X4LABEL" | "4X5LABEL" | "4X6LABEL" | "6X4LABEL" | "2X7LABEL";
  receiptOption?: "SAME_PAGE" | "SEPARATE_PAGE" | "NONE";
  suppressPostage?: boolean;
  suppressMailDate?: boolean;
  returnLabel?: boolean;
  packageNumber?: number;
  totalPackages?: number;
  brandingImageFormat?: "ONE_SQUARE" | "TWO_SQUARES" | "RECTANGLE" | "NONE";
  brandingImageUUIDs?: string[];
  includeLabelBrokerPDF?: boolean;
  addImageComments?: boolean;
}

export interface UspsErrorResponse {
  apiVersion: string;
  error: {
    code: string;
    message: string;
    errors?: Array<{
      status?: string;
      code?: string;
      title?: string;
      detail?: string;
      source?: { parameter?: string; example?: string };
    }>;
  };
}
