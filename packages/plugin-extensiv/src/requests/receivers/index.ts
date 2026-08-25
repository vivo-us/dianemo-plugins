import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  GetReceiverItemsOptions,
  GetReceiverItemsResponse,
  GetReceiverOptions,
  GetReceiversOptions,
  GetReceiversResponse,
  Receiver,
  ReceiverItem,
} from "./types.js";

export const getReceivers = async (
  clientName: string,
  options?: Partial<GetReceiversOptions>
): Promise<GetReceiversResponse> => {
  const res = await tryHandleRequest<GetReceiversResponse>(
    {
      clientName,
      requestName: "extensiv.receivers.list",
      method: "GET",
      url: `/inventory/receivers`,
      params: options,
    },
    "EXT_0021",
    "Failed to fetch Extensiv receivers"
  );
  return res.data;
};

export const getReceiver = async (
  clientName: string,
  receiverId: number,
  options?: Partial<GetReceiverOptions>
): Promise<Receiver> => {
  const res = await tryHandleRequest<Receiver>(
    {
      clientName,
      requestName: "extensiv.receivers.get",
      method: "GET",
      url: `/inventory/receivers/${receiverId}`,
      params: options,
    },
    "EXT_0022",
    "Failed to fetch Extensiv receiver"
  );
  return res.data;
};

export const getReceiverItems = async (
  clientName: string,
  receiverId: number,
  options?: Partial<GetReceiverItemsOptions>
): Promise<GetReceiverItemsResponse> => {
  const res = await tryHandleRequest<GetReceiverItemsResponse>(
    {
      clientName,
      requestName: "extensiv.receivers.listItems",
      method: "GET",
      url: `/inventory/receivers/${receiverId}/items`,
      params: options,
    },
    "EXT_0023",
    "Failed to fetch Extensiv receiver items"
  );
  return res.data;
};

export const getReceiverItem = async (
  clientName: string,
  receiverId: number,
  itemId: number,
  options?: Partial<GetReceiverItemsOptions>
): Promise<ReceiverItem> => {
  const res = await tryHandleRequest<ReceiverItem>(
    {
      clientName,
      requestName: "extensiv.receivers.getItem",
      method: "GET",
      url: `/inventory/receivers/${receiverId}/items/${itemId}`,
      params: options,
    },
    "EXT_0024",
    "Failed to fetch Extensiv receiver item"
  );
  return res.data;
};
