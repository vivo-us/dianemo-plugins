export interface AmazonFinancialEventBase {
  AmazonOrderId: string;
  SellerOrderId: string;
  MarketplaceName: string;
  PostedDate: string;
}

export interface AmazonFinancialRefundEvent extends AmazonFinancialEventBase {
  ShipmentItemAdjustmentList: {
    SellerSKU: string;
    OrderAdjustmentItemId: string;
    QuantityShipped: number;
    ItemChargeAdjustmentList: {
      ChargeType: string;
      ChargeAmount: {
        CurrencyCode: string;
        CurrencyAmount: number;
      };
    }[];
    ItemFeeAdjustmentList: {
      FeeType: string;
      FeeAmount: {
        CurrencyCode: string;
        CurrencyAmount: number;
      };
    }[];
    ItemTaxWithheldList: {
      TaxCollectionModel: string;
      TaxesWithheld: {
        ChargeType: string;
        ChargeAmount: {
          CurrencyCode: string;
          CurrencyAmount: number;
        };
      }[];
    }[];
  }[];
}
interface AmazonFinancialShipmentEvent extends AmazonFinancialEventBase {
  ShipmentItemList: {
    SellerSKU: string;
    OrderItemId: string;
    QuantityShipped: number;
    ItemChargeList: {
      ChargeType: string;
      ChargeAmount: {
        CurrencyCode: string;
        CurrencyAmount: number;
      };
    }[];
    ItemFeeList: {
      FeeType: string;
      FeeAmount: {
        CurrencyCode: string;
        CurrencyAmount: number;
      };
    }[];
    ItemTaxWithheldList: {
      TaxCollectionModel: string;
      TaxesWithheld: {
        ChargeType: string;
        ChargeAmount: {
          CurrencyCode: string;
          CurrencyAmount: number;
        };
      }[];
    }[];
  }[];
}
export interface GetFinancialEventsByOrderResponse {
  payload: {
    FinancialEvents: {
      [key: string]: unknown;
      RefundEventList: AmazonFinancialRefundEvent[];
      ShipmentEventList: AmazonFinancialShipmentEvent[];
    };
  };
  errors?: unknown[];
}
