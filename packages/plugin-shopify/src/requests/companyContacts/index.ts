import { OBJECT_COST, connectionCost } from "../utils/queryCost.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { ShopifyCompanyContactResponse } from "./types.js";
import { RequestError } from "@dianemo/core";

const LOCATION_PAGE_SIZE = 10;

const companyContactFields = `{
  id
  company {
    id
    locations(first: ${LOCATION_PAGE_SIZE}) {
      edges {
        node {
          id
        }
      }
    }
  }
}`;

const CONTACT_COST =
  2 * OBJECT_COST + connectionCost(LOCATION_PAGE_SIZE, OBJECT_COST);

export const getOne = async (clientName: string, id: string) => {
  const query = `query GetCompanyContact($id: ID!) {
    companyContact(id: $id) ${companyContactFields}
  }`;
  const variables = { id };
  const res = await handleGraphQLRequest<ShopifyCompanyContactResponse>(
    clientName,
    "SHO_0037",
    "Failed to fetch Shopify company contact",
    CONTACT_COST,
    "shopify.companyContacts.get",
    query,
    variables
  );
  if (!res.data.companyContact) {
    // A distinct code from the transport failure above: the request succeeded
    // and there is no such contact, which is the caller's `id` to fix and not a
    // condition anything should retry.
    throw new RequestError("SHO_0036", "Shopify company contact not found", {
      metadata: { context: id },
    });
  }
  return res.data.companyContact;
};
