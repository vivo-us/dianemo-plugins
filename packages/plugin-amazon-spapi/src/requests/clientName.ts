import { GLOBAL_ORGANIZATION_SEGMENT, parseClientName } from "@dianemo/core";

/**
 * The sub-client segment restricted-data traffic is routed to.
 *
 * Lives here rather than in client.ts so that both the template that builds the
 * client and the request path that addresses it can name it without the two
 * importing each other.
 */
export const PII_SEGMENT = "pii";

/**
 * The selling partner id an `amazonSpapi` client name was built for.
 *
 * SP-API puts the seller id in several request paths, and it is the grant the
 * account's tokens are cached under. It is the alias segment of the client
 * name — `amazonSpapi:<orgId|_>:<sellingPartnerId>` — so callers pass one
 * client name rather than the same identifier twice.
 */
export function sellingPartnerIdOf(clientName: string): string {
  return parse(clientName).alias;
}

/**
 * The account client name a sub-client name descends from.
 *
 * Requests address a `<region>:<endpoint>` sub-client, but the restricted data
 * token one of them needs is minted through the account's own `tokens`
 * endpoint — so the interceptor has to climb back to the name
 * `handleSpapiRequest` was handed.
 */
export function accountClientNameOf(clientName: string): string {
  const { templateName, organizationId, alias } = parse(clientName);
  return `${templateName}:${organizationId ?? GLOBAL_ORGANIZATION_SEGMENT}:${alias}`;
}

function parse(clientName: string) {
  const parsed = parseClientName(clientName);
  if (!parsed) {
    throw new Error(
      `Expected an amazonSpapi client name like "amazonSpapi:_:<sellingPartnerId>", received ${JSON.stringify(clientName)}. Build it with buildClientName("amazonSpapi", creds).`
    );
  }
  return parsed;
}
