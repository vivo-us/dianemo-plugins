import { parseClientName } from "@dianemo/core";

/**
 * One refresh token covers one *authorization*, not one profile, so the grant
 * *is* the client and its id is the alias segment of the client name — see
 * docs/channel-advisor-api.md#one-refresh-token-per-authorization-not-per-profile.
 *
 * Derived here rather than taken as an argument, for the same reason
 * amazon-spapi derives its own: the caller would be passing the same identifier
 * twice, and the two could then disagree — a request would authenticate as one
 * account while drawing on another's budget. Seed the grant under this id with
 * `handler.setGrantTokens(clientName, grantId, ...)`.
 */
export function grantIdOf(clientName: string): string {
  const parsed = parseClientName(clientName);
  if (!parsed) {
    throw new Error(
      `Expected a channelAdvisor client name like "channelAdvisor:_:<alias>", received ${JSON.stringify(clientName)}. Build it with buildClientName("channelAdvisor", creds).`
    );
  }
  return parsed.alias;
}
