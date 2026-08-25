import shopifyIdFormatter from "../utils/shopifyIdFormatter.js";
import { graphQLTypeName } from "../utils/graphQLTypeName.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { ShopifyRecordTypes } from "../types.js";
import { RequestError } from "@dianemo/core";
import {
  MUTATION_COST,
  OBJECT_COST,
  connectionCost,
} from "../utils/queryCost.js";
import {
  GetMetafieldsResponse,
  ShopifyMetafieldCreateAndUpdateData,
  ShopifyMetafieldCreateDefinition,
  ShopifyMetafieldCreateResponseData,
  ShopifyMetafieldType,
  ShopifyUpdateMetafieldResponseData,
  UpdateMetafieldInput,
  UpdateMetafieldInputFormatted,
} from "./types.js";

const METAFIELD_PAGE_SIZE = 100;

const DEFINITION_TAKEN = "TAKEN";

export const get = async (
  clientName: string,
  ownerId: string,
  recordType: ShopifyRecordTypes
) => {
  const formattedOwnerId = shopifyIdFormatter(ownerId, recordType);
  // Interpolated rather than passed as a variable: an inline fragment's type
  // cannot be a variable. Safe because `ShopifyRecordTypes` is a closed union
  // and every member maps to a fixed schema name.
  const formattedRecordType = graphQLTypeName(recordType);
  // `value` is aliased from `jsonValue`. Shopify's own `value` is always a
  // String — a json metafield's `{"foo":1}` arrives as literal characters — while
  // every structured member of `ShopifyMetafield` promises the parsed object,
  // which is what `jsonValue` returns.
  const query = `query metafields($id: ID!) {
      node(id: $id) {
        ... on ${formattedRecordType} {
          metafields(first: ${METAFIELD_PAGE_SIZE}) {
            edges {
              node {
                id
                namespace
                key
                value: jsonValue
                type
                description
                compareDigest
                createdAt
                updatedAt
              }
            }
          }
        }
      }
    }`;

  const res = await handleGraphQLRequest<GetMetafieldsResponse>(
    clientName,
    "SHO_0054",
    "Failed to fetch Shopify metafields",
    OBJECT_COST + connectionCost(METAFIELD_PAGE_SIZE, OBJECT_COST),
    "shopify.metafields.list",
    query,
    { id: formattedOwnerId }
  );
  if (!res.data.node || "metafields" in res.data.node === false) return null;

  return res.data.node.metafields.edges.map((edge) => edge.node);
};

export const update = async (
  clientName: string,
  ownerId: string,
  recordType: ShopifyRecordTypes,
  metafields: UpdateMetafieldInput[]
) => {
  const formattedOwnerId = shopifyIdFormatter(ownerId, recordType);
  const query = `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
          value
        }
        userErrors {
          field
          message
          code
        }
      }
    }`;

  const formattedMetafields: UpdateMetafieldInputFormatted[] = metafields.map(
    (mf) => ({ ...mf, ownerId: formattedOwnerId })
  );

  const variables = { metafields: formattedMetafields };

  return await handleGraphQLRequest<ShopifyUpdateMetafieldResponseData>(
    clientName,
    "SHO_0055",
    "Failed to update Shopify metafields",
    MUTATION_COST + 3 * OBJECT_COST,
    "shopify.metafields.set",
    query,
    variables
  );
};

export const create = async (
  clientName: string,
  definition: ShopifyMetafieldCreateDefinition
) => {
  const query = `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
        }
        userErrors {
          field
          message
          code
        }
      }
    }`;

  const variables = { definition };

  return await handleGraphQLRequest<ShopifyMetafieldCreateResponseData>(
    clientName,
    "SHO_0056",
    "Failed to create Shopify metafield definition",
    MUTATION_COST + 3 * OBJECT_COST,
    "shopify.metafields.definitionCreate",
    query,
    variables
  );
};

/**
 * Defines a metafield if it is not defined yet, then writes a value to it.
 *
 * A definition that already exists is the expected state on every call after the
 * first, which is the whole point of pairing the two steps. Treating Shopify's
 * `TAKEN` as a failure meant this worked exactly once per namespace and key and
 * threw from then on, never writing the value again.
 *
 * `TAKEN` is the documented code for that collision, but it is **unverified
 * against a live shop** — which is why every other `userErrors` code is still
 * fatal rather than assumed benign.
 */
export const createAndUpdate = async <T extends ShopifyMetafieldType>(
  clientName: string,
  ownerId: string | number,
  recordType: ShopifyRecordTypes,
  definition: ShopifyMetafieldCreateAndUpdateData<T>
) => {
  const formattedOwnerId = shopifyIdFormatter(ownerId, recordType);
  const { value, ...definitionWithoutValue } = definition;

  const newMetafield = await create(clientName, definitionWithoutValue);

  const blockingErrors =
    newMetafield.data.metafieldDefinitionCreate.userErrors.filter(
      (err) => err.code !== DEFINITION_TAKEN
    );
  if (blockingErrors.length) {
    throw new RequestError(
      "SHO_0057",
      "Failed to create and update Shopify metafield",
      {
        metadata: {
          context:
            blockingErrors.map((err) => err.message).join(", ") ||
            "Unknown error",
        },
      }
    );
  }

  const updatedMetafield = await update(
    clientName,
    formattedOwnerId,
    recordType,
    [
      {
        key: definition.key,
        namespace: definition.namespace,
        value,
      },
    ]
  );

  return updatedMetafield;
};
