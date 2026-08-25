import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  HelpScoutConversationThreads,
  HelpScoutConversationWithoutThreads,
  HelpScoutConversationWithThreads,
} from "./types.js";

export const getConversation = async (
  clientName: string,
  id: number
): Promise<HelpScoutConversationWithoutThreads> => {
  const res = await tryHandleRequest<HelpScoutConversationWithoutThreads>(
    {
      clientName,
      requestName: "helpscout.conversations.get",
      method: "GET",
      url: `/v2/conversations/${id}`,
    },
    "HSC_0001",
    "Failed to fetch HelpScout conversation"
  );
  return res.data;
};

/**
 * The embedded thread list is truncated by Help Scout and not paginated, so this
 * silently returns a short array on a long conversation. Use
 * `getConversationThreads` when the caller needs all of them. See
 * docs/helpscout-api.md#embedded-threads-are-truncated
 */
export const getConversationWithThreads = async (
  clientName: string,
  id: number
): Promise<HelpScoutConversationWithThreads> => {
  const res = await tryHandleRequest<HelpScoutConversationWithThreads>(
    {
      clientName,
      requestName: "helpscout.conversations.getWithThreads",
      method: "GET",
      url: `/v2/conversations/${id}?embed=threads`,
    },
    "HSC_0002",
    "Failed to fetch HelpScout conversation with threads"
  );
  return res.data;
};

/**
 * Oldest first, and the only complete view of a conversation's threads — keep
 * requesting while `page.number < page.totalPages`.
 */
export const getConversationThreads = async (
  clientName: string,
  id: number,
  page = 1
): Promise<HelpScoutConversationThreads> => {
  const res = await tryHandleRequest<HelpScoutConversationThreads>(
    {
      clientName,
      requestName: "helpscout.conversations.getThreads",
      method: "GET",
      url: `/v2/conversations/${id}/threads`,
      params: { page: String(page) },
    },
    "HSC_0003",
    "Failed to fetch HelpScout conversation threads"
  );
  return res.data;
};
