export interface ShopifyCreateDraftOrderResponseData {
  draftOrderCreate: {
    draftOrder: {
      id: string;
    };
  };
}

export interface ShopifyAddress {
  company?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
}

export interface ShopifyGetDraftOrderResponseData {
  draftOrder: {
    id: string;
    name: string;
  };
}

export interface ShopifyCreateDraftOrder {
  purchasingEntity: {
    purchasingCompany: {
      companyContactId: string;
      companyId: string;
      companyLocationId: string;
    };
  };
  phone?: string;
  note?: string;
  taxExempt?: boolean;
  tags?: string[];
  shippingLine?: {
    title: string;
    price: number;
  };
  shippingAddress: ShopifyAddress;
  billingAddress: ShopifyAddress;
  appliedDiscount?: {
    description: string;
    value: number;
    amount: number;
    valueType: "FIXED_AMOUNT" | "PERCENTAGE";
    title: string;
  };
  metafields?: {
    key: string;
    value: string;
    /** Defaults to `custom` when omitted. */
    namespace?: string;
  }[];
  poNumber?: string;
  lineItems: {
    title?: string;
    originalUnitPrice?: number;
    quantity?: number;
    appliedDiscount?: {
      description: string;
      value: number;
      amount: number;
      valueType: "PERCENTAGE" | "FIXED_AMOUNT";
      title: string;
    };
    variantId?: string;
    priceOverride?: {
      amount: number;
      currencyCode: string;
    };
  }[];
  paymentTerms?: {
    paymentSchedules?: {
      dueAt?: string;
      issuedAt?: string;
    };
    paymentTermsTemplateId?: string;
  };
}
