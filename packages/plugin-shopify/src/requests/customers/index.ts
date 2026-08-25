import { GetManyCustomersResponse, GetOneCustomerResponse } from "./types.js";
import { OBJECT_COST, connectionCost } from "../utils/queryCost.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { GetManyBasicOptions } from "../types.js";
import { RequestError } from "@dianemo/core";
import {
  basicListArgumentTypes,
  buildListArguments,
  listPageSize,
} from "../utils/listArguments.js";

const customerFields = `{
  id
  firstName
  lastName
  tags
  defaultEmailAddress {
    emailAddress
  }
  addresses(first: 10) {
    address1
    address2
    city
    province
    country
    zip
    phone
  }
  companyContactProfiles {
    id
    title
    company {
      id
      name
    }
  }
}`;

/**
 * `addresses` is a list rather than a connection, so its `first: 10` does not
 * multiply through — see docs/shopify-api.md#query-cost.
 */
const CUSTOMER_COST = 5 * OBJECT_COST;

export const getMany = async (
  clientName: string,
  options?: GetManyBasicOptions
) => {
  const defaultOptions = { first: 10 };
  const mergedOptions = { ...defaultOptions, ...options };
  const args = buildListArguments(
    mergedOptions,
    basicListArgumentTypes("CustomerSortKeys")
  );
  const query = `query customers${args.declarations} {
    customers${args.arguments} {
      edges {
        node ${customerFields}
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;
  return await handleGraphQLRequest<GetManyCustomersResponse>(
    clientName,
    "SHO_0022",
    "Failed to fetch Shopify customers",
    connectionCost(listPageSize(mergedOptions), CUSTOMER_COST),
    "shopify.customers.list",
    query,
    args.variables
  );
};

export const getOne = async (clientName: string, id: string) => {
  const query = `query customer($id: ID!) {
    customer(id: $id) ${customerFields}
  }`;
  const res = await handleGraphQLRequest<GetOneCustomerResponse>(
    clientName,
    "SHO_0023",
    "Failed to fetch Shopify customer",
    CUSTOMER_COST,
    "shopify.customers.get",
    query,
    { id }
  );
  if (res.data.customer) return res.data.customer;
  throw new RequestError("SHO_0024", "Shopify customer not found", {
    metadata: { context: id },
  });
};
