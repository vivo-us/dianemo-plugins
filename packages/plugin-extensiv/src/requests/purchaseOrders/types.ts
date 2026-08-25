import { ExtensivAddress, ExtensivItemId, ExtensivNamedId } from "../types.js";

interface BasePurchaseOrderData {
  IssueDate?: string;
  Supplier?: ExtensivSupplier;
  Notes?: string;
  ExternalId?: string;
}

export interface ExtensivPurchaseOrder {
  ReadOnly: {
    PurchaseOrderId: number;
    CreationDate: string;
    LastModifiedDate: string;
    Closed: boolean;
  };
  PurchaseOrderNumber: string;
  CustomerIdentifier: ExtensivCustomerIdentifier;
  IssueDate: string;
  Supplier: ExtensivSupplier;
  Notes: string;
  LineItems: CreatedPurchaseOrderItem[];
  _links: Record<string, Record<"href", string>>;
}

interface CreatedPurchaseOrderItem extends ExtensivPurchaseOrderItem {
  PurchaseOrderLineItemId: number;
}

export interface CreatePurchaseOrderData extends BasePurchaseOrderData {
  PurchaseOrderNumber: string;
  Supplier: ExtensivSupplier;
  CustomerIdentifier: Partial<ExtensivCustomerIdentifier>;
  LineItems: ExtensivPurchaseOrderItem[];
}

interface ExtensivCustomerIdentifier {
  Name: string;
  Id: number;
  ExternalId: string;
}

interface ExtensivSupplier extends ExtensivAddress {
  ContactId: number;
  PhoneNumber?: string;
  Fax?: string;
  EmailAddress?: string;
  Dept?: string;
  Code?: string;
}

export interface ExtensivPurchaseOrderItem {
  ItemIdentifier: Partial<ExtensivItemId>;
  Qualifier?: string;
  Quantity: number;
  ExpectedFacility: Partial<ExtensivNamedId>;
  ExpectedDate?: string;
  CancelDate?: string;
  Notes?: string;
  Price?: number;
}

export interface ExtensivCreatePurchaseOrderResponse {
  ReadOnly: {
    PurchaseOrderId: number;
    CreationDate: string;
    LastModifiedDate: string;
    Closed: boolean;
  };
  PurchaseOrderNumber: string;
  CustomerIdentifier: ExtensivNamedId;
  LineItems: {
    PurchaseOrderLineItemId: number;
    ItemIdentifier: ExtensivItemId;
    Quantity: number;
    ExpectedFacility: ExtensivNamedId;
    Price: number;
  }[];
  _links: {
    Rel: string;
    Href: string;
    isTemplated: boolean;
  }[];
}

export interface UpdatePurchaseOrderData extends BasePurchaseOrderData {
  PurchaseOrderNumber: string;
  LineItems: UpdatePurchaseOrderItem[];
}

interface UpdatePurchaseOrderItem extends ExtensivPurchaseOrderItem {
  PurchaseOrderLineItemId?: number;
}
