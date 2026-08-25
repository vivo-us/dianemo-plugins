import { OBJECT_COST, connectionCost } from "../utils/queryCost.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { GetManyBasicOptions } from "../types.js";
import { RequestError } from "@dianemo/core";
import {
  basicListArgumentTypes,
  buildListArguments,
  listPageSize,
} from "../utils/listArguments.js";
import {
  GetManyCompanyLocationsResponse,
  GetOneCompanyLocationResponse,
} from "./types.js";

const companyLocationFields = `{
  id
  taxSettings{
    taxExempt
  }
  company {
    id
  }
  buyerExperienceConfiguration{
    paymentTermsTemplate{
      id
      translatedName
      name
      paymentTermsType
    }
  }
}`;

const LOCATION_COST = 5 * OBJECT_COST;

export const getMany = async (
  clientName: string,
  options?: GetManyBasicOptions
) => {
  const defaultOptions = { first: 10 };
  const mergedOptions = { ...defaultOptions, ...options };
  const args = buildListArguments(
    mergedOptions,
    basicListArgumentTypes("CompanyLocationSortKeys")
  );
  const query = `query companyLocations${args.declarations} {
    companyLocations${args.arguments} {
      edges {
        node ${companyLocationFields}
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;
  return await handleGraphQLRequest<GetManyCompanyLocationsResponse>(
    clientName,
    "SHO_0028",
    "Failed to fetch Shopify company locations",
    connectionCost(listPageSize(mergedOptions), LOCATION_COST),
    "shopify.companyLocations.list",
    query,
    args.variables
  );
};

export const getOne = async (clientName: string, id: string) => {
  const query = `query companyLocation($id: ID!) {
    companyLocation(id: $id) ${companyLocationFields}
  }`;
  const res = await handleGraphQLRequest<GetOneCompanyLocationResponse>(
    clientName,
    "SHO_0027",
    "Failed to fetch Shopify company location",
    LOCATION_COST,
    "shopify.companyLocations.get",
    query,
    { id }
  );
  if (res.data.companyLocation) return res.data.companyLocation;
  // Its own code: a caller matching on the code needs to tell "Shopify is
  // unreachable" from "that location does not exist".
  throw new RequestError("SHO_0029", "Shopify company location not found", {
    metadata: { context: id },
  });
};
