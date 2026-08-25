export type NeweggReturnsApiVersion = 307 | 309 | 320;

export interface GetNeweggReturnsFilters {
  IssueUser?: string;
  PageInfo?: {
    PageIndex?: number;
    PageSize?: number; //Max is 100
  };
  KeywordsType?: GetNeweggReturnsKeywordsType;
  KeywordsValue?: string;
  Status?: NeweggReturnsStatusType;
  RMADateFrom?: Date; // Pacific Standard Time
  RMADateTo?: Date; // Pacific Standard Time
  RMAType?: NeweggRMAType;
  ProcessedBy?: NeweggProcessedByType;
}

export interface NeweggReturnResponse {
  NeweggAPIResponse: {
    IsSuccess: "true" | "false";
    OperationType: string;
    SellerID: string;
    ResponseBody: {
      PageInfo: {
        TotalCount: number;
        TotalPageCount: number;
        PageIndex: number;
        PageSize: number;
      };
      RMAInfoList?: {
        RMAInfo: NeweggRMAInfo[] | NeweggRMAInfo;
      };
    };
    ResponseDate: string; // Pacific Standard Time
  };
}

export interface NeweggRMAInfo {
  RMANumber: number;
  RMAType: 1 | 2; // 1 => Replacement // 2 => Refund
  RMATypeDescription: "Refund" | "Replacement";
  SellerRMANumber: string;
  IssueUser: string;
  RMADate: string; // Pacific Standard Time
  RMAStatus: NeweggReturnsStatusType;
  RMAStatusDescription:
    "Open" | "Received" | "Rejected" | "Voided" | "Closed" | "Processing";
  OrderNumber: number;
  OrderDate: string; // Pacific Standard Time
  InvoiceNumber: number;
  OrderAmount: number;
  AvailableRefundAmount: number;
  RMAProcessedBy: "Newegg" | "Seller";
  RMANote: string;
  PriorRefundAmount: number;
  CustomerName: string;
  CustomerPhoneNumber: string;
  CustomerEmailAddress: string;
  ShipToAddress1: string;
  ShipToAddress2: string;
  ShipToCityName: string;
  ShipToStateCode: string;
  ShipToZipCode: string;
  ShipToCountryCode: string;
  ShipToLastName: string;
  ShipToFirstName: string;
  ShipToCompany: string;
  ReturnShippingLabel?: {
    Label: {
      TrackingNumber: string;
      TrackingURL: string;
      LabelEstimateCost: number;
      PaidBy: string;
    };
  };
  RMATransactionList: {
    RMATransaction: {
      SellerPartNumber: string;
      MfrPartNumber: string;
      NeweggItemNumber: string;
      Description: string;
      UnitPrice: number;
      ReturnQuantity: number;
      ReturnUnitPrice: number;
      RefundShippingPrice: number;
      RMAReason: NeweggReturnReasonNumber;
      RMAReasonDescription:
        | "Item damage"
        | "Item is defective or is not working"
        | "Incompatible"
        | "No longer needed"
        | "Inaccurate item description on website"
        | "Ordered wrong item"
        | "Sent wrong item"
        | "Product dissatisfaction"
        | "Other Reason";
    };
  };
}

// 1 Open, 2 Received, 3 Rejected, 4 Voided, 5 Closed, 6 Processing
export type NeweggReturnsStatusType = 1 | 2 | 3 | 4 | 5 | 6;

// Which field `Keywords` is matched against: 1 RMA number, 2 order number, 3 customer name
type GetNeweggReturnsKeywordsType = 1 | 2 | 3;

// 0 All, 1 Replacement, 2 Refund
type NeweggRMAType = 0 | 1 | 2;

// 0 All, 1 Seller, 2 Newegg
type NeweggProcessedByType = 0 | 1 | 2;

type NeweggReturnReasonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
