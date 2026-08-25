import { graphQLTypeName } from "./graphQLTypeName.js";
import { ShopifyRecordTypes } from "../types.js";

const shopifyIdFormatter = (id: string | number, type: ShopifyRecordTypes) => {
  if (typeof id === "number" || !id.toString().startsWith("gid://shopify/")) {
    return `gid://shopify/${graphQLTypeName(type)}/${id}`;
  }
  return id;
};

export default shopifyIdFormatter;
