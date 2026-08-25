import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestConfig } from "@dianemo/core";
import { grantIdOf } from "./clientName.js";

/**
 * Every request goes through here so that every request carries a `grantId`. A
 * grantless request refreshes through the client-level `refreshConfig`, which
 * for ChannelAdvisor cannot work —
 * /docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh.
 * Enforcing the grant in one place rather than at sixty-odd call sites is what
 * keeps that from creeping back in.
 *
 * The two `/oauth2/*` calls in `requests/auth` are the exceptions and go
 * straight to `tryHandleRequest`: they run before the account has a grant to
 * authenticate as.
 */
const handleCaRequest = async <T = unknown, D = unknown>(
  config: Omit<RequestConfig<D>, "grantId">,
  code: string,
  message: string
) =>
  await tryHandleRequest<T, D>(
    { ...config, grantId: grantIdOf(config.clientName) },
    code,
    message
  );

export default handleCaRequest;
