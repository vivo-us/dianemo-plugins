import { CAPagingQueryOptions, CAQueryOptions, Flag } from "../types.js";
import { BundleComponent } from "./bundleComponents/types.js";
import { DCQuantity } from "./dcQuantities/types.js";
import { Attribute } from "./attributes/types.js";
import { Child } from "./children/types.js";
import { Image } from "./images/types.js";
import { Label } from "./labels/types.js";

export type GetProductsOptions = CAPagingQueryOptions<
  keyof GetProduct,
  ProductExpand
>;

export type GetProductOptions = CAQueryOptions<keyof GetProduct, ProductExpand>;

export type ProductExpandOptions =
  | "Attributes"
  | "Images"
  | "Labels"
  | "DCQuantities"
  | "AliasRelationships"
  | "BundleComponents"
  | "Children";

export type ProductExpand = {
  options?: ProductExpandOptions[];
};

export interface CreateProductAliasData {
  ProfileID: number;
  SKU: string;
  AliasRelationships: {
    AliasProductSku?: string;
    AliasProductId?: number;
  }[];
}

export type BundleType = "None" | "BundleComponent" | "BundleItem";

export enum ProductType {
  Item = 0,
  Child = 1,
  Bundle = 2,
  Parent = 3,
}

export enum AliasType {
  None = 0,
  Reference = 1,
  Alias = 2,
}

interface BaseProduct {
  Sku: string;
  Title?: string;
  IsAvailableInStore?: boolean;
  IsBlocked?: boolean;
  IsBlockedFromAdvertising?: boolean;
  InfiniteQuantity?: boolean;
  IsExternalQuantityBlocked?: boolean;
  BlockComment?: string;
  ASIN?: string;
  Brand?: string;
  Condition?: string;
  Description?: string;
  EAN?: string;
  FlagDescription?: string;
  Flag?: Flag;
  HarmonizedCode?: string;
  ISBN?: string;
  Manufacturer?: string;
  MPN?: string;
  ShortDescription?: string;
  Subtitle?: string;
  TaxProductCode?: string;
  UPC?: string;
  WarehouseLocation?: string;
  Warranty?: string;
  MultipackQuantity?: number;
  Height?: number;
  Length?: number;
  Width?: number;
  Weight?: number;
  Cost?: number;
  Margin?: number;
  RetailPrice?: number;
  StartingPrice?: number;
  ReservePrice?: number;
  BuyItNowPrice?: number;
  StorePrice?: number;
  SecondChancePrice?: number;
  MinPrice?: number;
  MaxPrice?: number;
  SupplierName?: string;
  SupplierCode?: string;
  SupplierPO?: string;
  Classification?: string;
  BundleType?: BundleType;
  IsParent?: boolean;
  IsInRelationship?: boolean;
  ParentProductID?: number;
  RelationshipName?: string;
  VaryBy?: string;
  ReferenceSku?: string;
  ReferenceProductId?: number;
  AliasType?: AliasType;
  Attributes?: Attribute[];
}

export interface GetProduct extends BaseProduct {
  ID: number;
  ProfileID: number;
  BlockedFromAdvertisingDateUtc?: string;
  ReceivedDateUtc?: string;
  IsDisplayInStore?: boolean;
  StoreTitle?: string;
  StoreDescription?: string;
  BundleType: BundleType;
  ParentSku: string;
  CreateDateUtc: string;
  BlockedDateUtc?: string;
  LastSaleDateUtc?: string;
  UpdateDateUtc?: string;
  QuantityUpdateDateUtc?: string;
  ProductType: ProductType;
  TotalAvailableQuantity: number;
  OpenAllocatedQuantity: number;
  OpenAllocatedQuantityPooled: number;
  PendingCheckoutQuantity: number;
  PendingCheckoutQuantityPooled: number;
  PendingPaymentQuantity: number;
  PendingPaymentQuantityPooled: number;
  PendingShipmentQuantity: number;
  PendingShipmentQuantityPooled: number;
  TotalQuantity: number;
  TotalQuantityPooled: number;
  QuantitySoldLast7Days: number;
  QuantitySoldLast14Days: number;
  QuantitySoldLast30Days: number;
  QuantitySoldLast60Days: number;
  QuantitySoldLast90Days: number;
  Attributes?: Attribute[];
  Images?: Image[];
  Labels?: Label[];
  DCQuantities?: DCQuantity[];
  BundleComponents?: BundleComponent[];
  Children?: Child[];
  AliasRelationships?: AliasRelationships[];
}

export interface CreateProduct extends BaseProduct {
  ProfileID: number;
  BundleType?: BundleType;
  Attributes?: Attribute[];
  BundleComponents?: Pick<BundleComponent, "ComponentSku" | "Quantity">[];
}

export interface UpdateProduct extends Partial<BaseProduct> {}

export interface AliasRelationships {
  AliasProductId: number;
  ReferenceProductID: number;
  ProfileID: number;
  AliasProductSku: string;
}
