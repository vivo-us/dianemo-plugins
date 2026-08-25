import {
  ExtensivWeightedDimensions,
  ExtensivItemId,
  ExtensivNamedId,
  ExtensivNamedValue,
} from "../types.js";

type ReceiverItemDetail = "None" | "SavedElements" | "All";

export interface GetReceiverItemsOptions {
  /** Comma-delimited combinations are accepted despite the union. Defaults to "None". */
  detail: ReceiverItemDetail;
}

export interface GetReceiverOptions {
  /** Comma-delimited combinations are accepted despite the union. Defaults to "None". */
  detail:
    | "None"
    | "ReceiveItems"
    | "BillingDetails"
    | "SavedElements"
    | "All"
    | "ProposedBilling";
  /** As `detail`, for the receive items inside the receiver. */
  itemDetail: ReceiverItemDetail;
}

export interface GetReceiversOptions extends GetReceiverOptions {
  /** Records per page; this endpoint's documented ceiling is 500. */
  pgsiz: number;
  /** 1-based. */
  pgnum: number;
  rql: string;
  sort: string;
  purchaseOrderId: number;
  /**
   * Defaults to 0
   *
   * 0: Normal
   * 1: Return
   * 2: ASN (Receive Agent)
   */
  receiverType: 0 | 1 | 2;
}

export interface Receiver {
  ReadOnly: ReceiverReadOnly;
  ReceiveItems?: ReceiverItem[];
  ReferenceNum: string;
  PoNum: string;
  ExternalId: string;
  ReceiptAdviceNumber: string;
  ArrivalDate: string;
  ExpectedDate: string;
  Notes: string;
  Billing: ReceiverBilling;
  ScacCode: string;
  Carrier: string;
  BillOfLading: string;
  DoorNumber: string;
  TrackingNumber: string;
  TrailerNumber: string;
  SealNumber: string;
  CapacityTypeIdentifier: ExtensivNamedId;
  NumUnits1: number;
  Unit1Identifier: ExtensivNamedId;
  NumUnits2: number;
  Unit2Identifier: ExtensivNamedId;
  TotalWeight: number;
  TotalVolume: number;
  SavedElements: ExtensivNamedValue[];
  _embedded: Record<string, ReceiverEmbedded[]>;
}

interface ReceiptAdviceSendInfo {
  MarkInfo: {
    Candidate: number;
    ChannelIdentifier: ExtensivNamedId;
    TransformIds: string;
  };
  SentInfo: {
    Sent: boolean;
    Date: string;
  };
}

interface ExtensivPalletInfo {
  PalletId: number; //for identifying: system auto generated at time of POSTs or PUTs
  Label: string;
  PalletTypeIdentifier: ExtensivNamedId;
  Metric: ExtensivWeightedDimensions;
  Imperial: ExtensivWeightedDimensions;
}

interface ReceiverReadOnly {
  ReceiverId: number;
  /**
   * The receiver type
   *
   * - 0: Normal - yields receivers and converted ASNs
   * - 1: Return - yields returns
   * - 2: ReceiveAgainst - yields ASN candidates
   * - 3: OnlyASNs - yields ASN candidates, and converted ASNs Used in SmartScan workflow
   * - 4: AllButASNs - yields receivers and returns Used in SmartScan Workflow
   */
  ReceiverType: 0 | 1 | 2 | 3 | 4;
  /**
   * - True means the receipt will be created in an open "incomplete" state, where notification is deferred until receiver is completed;
   * - False means the receipt will be created in a "complete" state
   */
  DeferNotification: boolean;
  ReceiptAdviceSendInfo: ReceiptAdviceSendInfo;
  CustomerIdentifier: {
    ExternalId: string;
    Name: string;
    Id: number;
  };
  FacilityIdentifier: ExtensivNamedId;
  /**
   * How the transaction entered the system.
   *
   * - 0: Unknown
   * - 1: UiManual
   * - 2: UiImport
   * - 3: AutomatedImport
   * - 4: ExternalSoapApi
   * - 5: QuickBooksSoapApi
   * - 6: AutomatedSystemCharge
   * - 7: RestApi
   */
  WarehouseTransactionSourceType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /**
   * The agent creating the transaction
   *
   * - 0: unknown
   * - 1: ManualWarehouseUser
   * - 2: ManualCustomerUser
   * - 3: Ftp
   * - 4: Api
   */
  TransactionEntryType: 0 | 1 | 2 | 3 | 4;
  ImportChannelIdentifier: ExtensivNamedId;
  CreationDate: string;
  CreatedByIdentifier: ExtensivNamedId;
  LastModifiedDate: string;
  LastModifiedByIdentifier: ExtensivNamedId;
  /**
   * Receiver Status Types:
   *
   * - 0: Open	- Has not yet been confirmed
   * - 1: Closed - Has been confirmed
   * - 2: Canceled - Has been canceled
   */
  Status: 0 | 1 | 2;
}

interface ReceiverBilling {
  BillingCharges: [
    {
      /**
       * Charge types:
       *
       * - 1: Handling
       * - 2: Storage
       * - 3: PrepaidFreight
       * - 4: ThirdPartyFreight
       * - 5: SpecialCharges
       * - 6: Materials
       * - 7: AutoCalcStorage - used internally for sys-gen'ed charges
       * - 8: AutoCalcHandling- used internally for sys-gen'ed charges
       */
      ChargeType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
      Subtotal: number;
      Details: [
        {
          WarehouseTransactionPriceCalcId: number;
          NumUnits: number;
          ChargeLabel: string;
          UnitDescription: string;
          ChargePerUnit: number;
          GlAcctNum: string;
          Sku: string;
          PtItem: string;
          PtItemDescription: string;
          PtArAcct: string;
          SystemGenerated: true;
          TaxCode?: string;
        },
      ];
    },
  ];
}

interface ReceiverEmbedded {
  ReadOnly: {
    /**  Provided when GETting, ignored when POSTing new or PUTting existing single receive item, required when PUTting list of receive items*/
    ReceiveItemId: number;
    FullyShippedDate: string;
    UnitIdentifier: ExtensivNamedId;
    SecondaryUnitIdentifier: ExtensivNamedId;
    ExpectedQty: number;
    InventoryLevels: {
      OnHand: number;
      Available: number; // In the warehouse but not allocated to any order
      SecondaryAvailable: number;
    };
    OnHoldDate: string; // The date the receive item was most recently placed on hold
    OnHoldUserIdentifier: ExtensivNamedId;
    FacilityIdentifier: ExtensivNamedId;
    RowVersion: string;
  };
  ItemIdentifier: ExtensivItemId;
  Qualifier: string; // Item qualifer; null is interpreted same as empty string
  ExternalId: string; // Connection of this receive item to the same receive item on some other system
  Qty: number; // Primary inventory quantity received; if not specified, must specify SecondaryQty from which Qty will be calculated
  SecondaryQty: number; // If not specified and Item.Options.SecondaryUnit defined will be calculated from Qty; error if specified and Item.Options.SecondaryUnit null
  LotNumber: string; // Item must be enabled for lot numbers to use this field
  SerialNumber: string; // Item must be enabled for serial numbers to use this field
  ExpirationDate: string; // Item must be enabled for expiration dates to use this field
  Cost: number; // Item must be enabled for cost to use this field
  SupplierIdentifier: ExtensivNamedId;
  LocationInfo: {
    LocationId: number; //for identifying; system auto generated
    Display: string; //Location name, as displayed in the wms
    RawField1: string;
    RawField2: string;
    RawField3: string;
    RawField4: string;
  };
  PalletInfo: ExtensivPalletInfo;
  WeightImperial: number; // total weight of receive item, imperial; if specified and metric not specified, business logic computes metric
  WeightMetric: number; //as WeightImperial, in the other direction
  OnHold: true; //If true, this receive item is not available for allocation
  OnHoldReason: string;
  SavedElements: ExtensivNamedValue[];
}

export interface ReceiverItem {
  ReadOnly: {
    ReceiveItemId: number;
    FullyShippedDate: string;
    UnitIdentifier: ExtensivNamedId;
    FacilityIdentifier: ExtensivNamedId;
    ReferenceNumber: string;
    TransactionID: number;
    RowVersion: string;
  };
  ItemIdentifier: ExtensivItemId;
  Qualifier: string;
  Qty: number;
  PalletInfo: ExtensivPalletInfo;
  WeightImperial: number;
  WeightMetric: number;
  OnHold: boolean;
  SavedElements: ExtensivNamedValue[];
  _links: [];
}

export interface GetReceiverItemsResponse {
  ResourceList: ReceiverItem[];
  _links: Record<string, Record<"href", string>>;
}

export interface GetReceiversResponse {
  TotalResults: number;
  ResourceList: Receiver[];
  _links: Record<string, Record<"href", string>>;
}
