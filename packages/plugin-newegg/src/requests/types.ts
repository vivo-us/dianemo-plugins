export enum NeweggItemUpdateType {
  NeweggPartNumber = "0",
  SellerPartNumber = "1",
  UPC = "2",
}

export enum NeweggItemCondition {
  New = "1",
  Refurbished = "2",
  "Used - Like New" = "3",
  "Used - Very Good" = "4",
  "Used - Good" = "5",
  "Used - Acceptable" = "6",
}

export enum NeweggItemFulfillmentOption {
  Seller = 0,
  Newegg = 1,
}

export enum NeweggNumericBoolean {
  False = 0,
  True = 1,
}

export type NeweggBoolean = "True" | "False";

export interface NeweggFeedWrapper<T> {
  NeweggEnvelope: {
    Header: {
      DocumentVersion: "2.0";
    };
    MessageType: string;
    Message: T;
  };
}
