export type AmazonShipmentStatus =
  | "WORKING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "RECEIVING"
  | "CANCELLED"
  | "DELETED"
  | "CLOSED"
  | "ERROR"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CHECKED_IN";

export type getShipmentsV0QueryOptions =
  fbaFulfillmentInboundV0QueryOptionsBase & {
    ShipmentStatusList?: AmazonShipmentStatus[];
    ShipmentIdList?: string[];
  };

export interface AmazonInboundFulfillmentBaseResponseV0<T> {
  payload: {
    ItemData: T[];
    NextToken?: string;
  };
}
export interface AmazonInboundShipmentDetailsV0 {
  ShipmentId: string;
  SellerSKU: string;
  FulfillmentNetworkSKU: string;
  QuantityShipped: number;
  QuantityReceived: number;
  QuantityInCase: number;
  PrepDetailsList: {
    PrepInstruction: string;
    PrepOwner: string;
  }[];
}

export interface AmazonFbaInboundFulfillmentShipmentResponseV0 {
  payload: AmazonFbaInboundFulfillmentShipmentPayloadDataV0;
}

export interface AmazonFbaInboundFulfillmentShipmentPayloadDataV0 {
  ShipmentData: AmazonFbaInboundFulfillmentShipmentDataV0[];
  NextToken: string;
}

export interface AmazonFbaInboundFulfillmentShipmentDataV0 {
  ShipmentId: string;
  ShipmentName: string;
  ShipFromAddress: {
    Name: string;
    AddressLine1: string;
    City: string;
    StateOrProvinceCode: string;
    CountryCode: string;
    PostalCode: string;
  };
  ShipmentStatus: AmazonShipmentStatus;
}

export interface PackageDetail {
  packageReferenceId: string;
  carrierCode: "FedEx" | "UPS";
  trackingNumber: string;
  shipDate: string;
  orderItems: ConfirmShipmentOrderItem[];
  carrierName?: string;
  shippingMethod?: string;
  shipFromSupplySourceId?: string;
}

interface ConfirmShipmentOrderItem {
  orderItemId: string;
  quantity: number;
  transparencyCodes?: string[];
}

export type fbaFulfillmentInboundV0QueryOptionsBase = {
  QueryType: "SHIPMENT" | "DATE_RANGE" | "NEXT_TOKEN";
  MarketplaceId: string;
  LastUpdatedAfter?: string;
  LastUpdatedBefore?: string;
  NextToken?: string;
};
