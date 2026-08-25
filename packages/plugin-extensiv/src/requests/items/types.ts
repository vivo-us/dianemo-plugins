import { ExtensivNamedId, ExtensivWeightedDimensions } from "../types.js";

interface Item {
  ReadOnly: ItemInfo;
  ItemId: number;
  Sku: string;
  Description: string;
  InventoryCategory: string;
  Qualifiers: [{ Qualifier: string; _links: Array<object> }];
  Options: Options[];
  _links: Array<object>;
}

interface ItemInfo {
  CustomerIdentifier: ExtensivNamedId;
  ItemId: number;
  CreationDate: Date;
  LastModifiedDate: Date;
  Deactivated: boolean;
  HasStorageRates: boolean;
  RowVersion: string;
}

export interface ItemList {
  TotalResults: number;
  ResourceList: Item[];
}

interface Options {
  InventoryUnit: {
    UnitIdentifier: ExtensivNamedId;
    MinimumStock: number;
    InventoryMethod: number;
  };
  PackageUnit: {
    Imperial: ExtensivWeightedDimensions;
    Metric: ExtensivWeightedDimensions;
    UnitIdentifier: ExtensivNamedId;
    InventoryUnitsPerUnit: number;
  };
  TrackBys: {
    TrackLotNumber: number;
    TrackSerialNumber: number;
    TrackExpirationDate: number;
    TrackCost: number;
    OutboundMobileSerialization: number;
    IsPickLotNumberRequired: boolean;
    IsPickSerialNumberRequired: boolean;
    IsPickExpirationDateRequired: boolean;
  };
  Pallets: {
    TypeIdentifier: ExtensivNamedId;
    Qty: number;
    Imperial: ExtensivWeightedDimensions;
    Metric: ExtensivWeightedDimensions;
  };
  Hazmat: { IsHazMat: boolean };
  DirectedPutaway: {
    ForceIntoPrefferedLocation: boolean;
    AllowMixedItemStorage: boolean;
    AllowMixedLotStorage: boolean;
  };
  AutoHoldOnReceive: boolean;
}
