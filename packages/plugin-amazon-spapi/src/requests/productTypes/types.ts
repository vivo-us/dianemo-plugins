import { AmazonMarketplaceId } from "../../utils/amazonSpapiData.js";

type Enforced = "ENFORCED" | "NOT_ENFORCED";

export interface GetProductTypesResponse {
  productTypeVersion: string;
  productTypes: ProductType[];
}

interface ProductType {
  name: string;
  displayName: string;
  marketplaceSettings: string[];
}

export interface GetProductTypeResponse {
  metaSchema?: Link;
  schema: Link;
  requirements: Enforced;
  requirementsEnforced: Enforced;
  propertyGroups: Record<string, PropertyGroup>;
  locale: string;
  marketplaceIds: AmazonMarketplaceId[];
  productType: string;
  displayName: string;
  productTypeVersion: {
    version: string;
    latest: boolean;
    releaseCandidate?: boolean;
  };
}

interface Link {
  link: {
    resource: string;
    verb: "GET";
  };
  checksum: string;
}

interface PropertyGroup {
  title?: string;
  description?: string;
  propertyNames?: string[];
}
