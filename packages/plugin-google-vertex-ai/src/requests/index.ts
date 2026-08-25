import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  CreateSessionResponse,
  GetAnswerData,
  GetAnswerResponse,
  SessionState,
} from "./types.js";

/**
 * `grantId` selects which OAuth grant on the client to authenticate with, and is
 * how the user-delegated path names the refresh token seeded for it. Omit it on
 * a service-account client: the signed assertion is the identity there, so a
 * grant would only partition the token cache.
 */
export interface VertexAiRequestOptions {
  grantId?: string;
}

/**
 * `session` continues a conversation, and Google wants the **fully-qualified
 * session name** — `createSession().name`, not the trailing id. It is the only
 * form that identifies a session in a request body, and the engine path it
 * embeds cannot be reconstructed from `baseUrl` on this side.
 */
export const getAnswer = async (
  clientName: string,
  query: string,
  { grantId }: VertexAiRequestOptions,
  session?: string
): Promise<GetAnswerResponse> => {
  const data: GetAnswerData = {
    query: { text: query },
    queryUnderstandingSpec: {
      queryClassificationSpec: { types: ["ADVERSARIAL_QUERY"] },
    },
    groundingSpec: { includeGroundingSupports: true },
    session,
  };
  const res = await tryHandleRequest<GetAnswerResponse>(
    {
      clientName,
      requestName: "googleVertexAi.servingConfigs.answer",
      grantId,
      method: "POST",
      url: `/servingConfigs/default_search:answer`,
      data,
    },
    "GVA_0001",
    "Failed to get answer from Google Vertex AI"
  );
  return res.data;
};

export const createSession = async (
  clientName: string,
  userId: string,
  { grantId }: VertexAiRequestOptions
): Promise<CreateSessionResponse> => {
  const res = await tryHandleRequest<CreateSessionResponse>(
    {
      clientName,
      requestName: "googleVertexAi.sessions.create",
      grantId,
      method: "POST",
      url: `/sessions`,
      data: { userPseudoId: userId.toString() },
    },
    "GVA_0002",
    "Failed to create Google Vertex AI session"
  );
  return res.data;
};

/**
 * `session` takes either form: `createSession().name` or the bare trailing id.
 * Unlike `getAnswer` the session is addressed by URL here, and `baseUrl` already
 * carries the engine path a qualified name repeats — passing the name through
 * untouched PATCHes `/sessions/projects/…/engines/…/sessions/<id>`, which is a
 * 404 every time.
 */
export const updateSessionState = async (
  clientName: string,
  session: string,
  state: SessionState,
  { grantId }: VertexAiRequestOptions
) => {
  const sessionId = session.substring(session.lastIndexOf("/") + 1);
  await tryHandleRequest(
    {
      clientName,
      requestName: "googleVertexAi.sessions.updateState",
      grantId,
      method: "PATCH",
      url: `/sessions/${sessionId}?updateMask=state`,
      data: { state },
    },
    "GVA_0003",
    "Failed to update Google Vertex AI session state"
  );
};
