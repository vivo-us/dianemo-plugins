import { MultiRecord, ShopifyRecordTypes } from "../types.js";

/**
 * Value types for complex metafields as `jsonValue` returns them, which is what
 * `metafields.get` selects. Shopify's metafield JSON is snake_cased and does not
 * match the camelCase of the rest of the Admin API, so these are spelled out
 * rather than reused from the shared types.
 */
interface ShopifyJsonMetafield {
  [key: string]: unknown;
}

interface ShopifyLinkMetafield {
  url: string;
  text: string;
}

interface ShopifyRatingMetafield {
  value: string;
  scale_min: string;
  scale_max: string;
}

interface ShopifyMeasurementMetafield {
  value: number;
  unit: string;
}

interface ShopifyDimensionMetafield extends ShopifyMeasurementMetafield {}
interface ShopifyVolumeMetafield extends ShopifyMeasurementMetafield {}
interface ShopifyWeightMetafield extends ShopifyMeasurementMetafield {}

/**
 * Not `ShopifyMoneyV2`: a money metafield's `jsonValue` carries `currency_code`,
 * where every other money object in the Admin API carries `currencyCode`.
 */
interface ShopifyMoneyMetafield {
  amount: string;
  currency_code: string;
}

/**
 * A rich-text metafield's `jsonValue` is a document tree rooted at
 * `{ type: "root", children: [...] }`. Deliberately shallow — the node types are
 * numerous and nothing here reads them.
 */
interface ShopifyRichTextMetafield {
  type: string;
  children: unknown[];
}
interface ShopifyMetafieldBase {
  id: string;
  namespace: string;
  key: string;
  description: string | null;
  compareDigest: string;
  createdAt: string;
  updatedAt: string;
}

export type ShopifyMetafield =
  | (ShopifyMetafieldBase & { type: "boolean"; value: string })
  | (ShopifyMetafieldBase & { type: "color"; value: string })
  | (ShopifyMetafieldBase & { type: "date"; value: string })
  | (ShopifyMetafieldBase & { type: "date_time"; value: string })
  | (ShopifyMetafieldBase & {
      type: "dimension";
      value: ShopifyDimensionMetafield;
    })
  | (ShopifyMetafieldBase & { type: "id"; value: string })
  | (ShopifyMetafieldBase & { type: "json"; value: ShopifyJsonMetafield })
  | (ShopifyMetafieldBase & { type: "link"; value: ShopifyLinkMetafield })
  | (ShopifyMetafieldBase & { type: "money"; value: ShopifyMoneyMetafield })
  | (ShopifyMetafieldBase & { type: "multi_line_text_field"; value: string })
  | (ShopifyMetafieldBase & { type: "number_decimal"; value: number })
  | (ShopifyMetafieldBase & { type: "number_integer"; value: number })
  | (ShopifyMetafieldBase & { type: "rating"; value: ShopifyRatingMetafield })
  | (ShopifyMetafieldBase & {
      type: "rich_text_field";
      value: ShopifyRichTextMetafield;
    })
  | (ShopifyMetafieldBase & { type: "single_line_text_field"; value: string })
  | (ShopifyMetafieldBase & { type: "url"; value: string })
  | (ShopifyMetafieldBase & { type: "volume"; value: ShopifyVolumeMetafield })
  | (ShopifyMetafieldBase & { type: "weight"; value: ShopifyWeightMetafield });

type ShopifyMetafieldTypeValues =
  | ShopifyJsonMetafield
  | ShopifyLinkMetafield
  | ShopifyRatingMetafield
  | ShopifyDimensionMetafield
  | ShopifyVolumeMetafield
  | ShopifyWeightMetafield
  | ShopifyMoneyMetafield
  | ShopifyRichTextMetafield
  | string
  | number;

export interface GetMetafieldsResponse {
  node: {
    metafields: MultiRecord<ShopifyMetafield>;
  };
}

export type UpdateMetafieldInput =
  | {
      id: string;
      key?: string;
      namespace?: string;
      value: ShopifyMetafieldTypeValues;
    }
  | {
      id?: never;
      key: string;
      namespace: string;
      value: ShopifyMetafieldTypeValues;
    };

export interface ShopifyUpdateMetafieldResponseData {
  metafieldsSet: {
    metafields: {
      key: string;
      namespace: string;
      value: string;
    }[];
    userErrors: {
      field: string[] | null;
      message: string;
      code: string | null;
    }[];
  };
}

export type UpdateMetafieldInputFormatted = UpdateMetafieldInput & {
  ownerId: string;
};

export type ShopifyMetafieldType = ShopifyMetafield["type"];

export type ShopifyMetafieldValueFor<T extends ShopifyMetafieldType> = Extract<
  ShopifyMetafield,
  { type: T }
>["value"];

export interface ShopifyMetafieldCreateDefinition<
  T extends ShopifyMetafieldType = ShopifyMetafieldType,
> {
  type: T;
  namespace: string;
  key: string;
  name: string;
  ownerType: ShopifyRecordTypes;
  description?: string;
}

export interface ShopifyMetafieldCreateAndUpdateData<
  T extends ShopifyMetafieldType = ShopifyMetafieldType,
> extends ShopifyMetafieldCreateDefinition<T> {
  value: ShopifyMetafieldValueFor<T>;
}

export interface ShopifyMetafieldCreateResponseData {
  metafieldDefinitionCreate: {
    createdDefinition: {
      id: string;
      name: string;
    };
    userErrors: {
      field: string[] | null;
      message: string;
      code: string | null;
    }[];
  };
}
