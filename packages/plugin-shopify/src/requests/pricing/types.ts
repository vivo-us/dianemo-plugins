export interface ShopifySetPricingVariables {
  productId: string;
  variants: {
    price?: number;
    id: string;
  }[];
}

export interface ShopifySetPricingResponse {
  productVariantsBulkUpdate: {
    product: {
      id: string;
    };
    productVariants: {
      id: string;
      metafields: {
        edges: {
          node: {
            namespace: string;
            key: string;
            value: string;
          };
        }[];
      };
    }[];
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}
