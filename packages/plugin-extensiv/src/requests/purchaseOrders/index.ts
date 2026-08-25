import { ExtensivListOptions, ExtensivRecordList } from "../types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  CreatePurchaseOrderData,
  ExtensivCreatePurchaseOrderResponse,
  ExtensivPurchaseOrder,
  UpdatePurchaseOrderData,
} from "./types.js";

export const getPurchaseOrders = async (
  clientName: string,
  options?: ExtensivListOptions
): Promise<ExtensivRecordList<ExtensivPurchaseOrder>> => {
  const res = await tryHandleRequest<ExtensivRecordList<ExtensivPurchaseOrder>>(
    {
      clientName,
      requestName: "extensiv.purchaseOrders.list",
      method: "GET",
      url: `/inventory/pos`,
      params: options,
    },
    "EXT_0016",
    "Failed to fetch Extensiv purchase orders"
  );
  return res.data;
};

export const getPurchaseOrder = async (
  clientName: string,
  purchaseOrderId: number
): Promise<{ data: ExtensivPurchaseOrder; etag: string }> => {
  const res = await tryHandleRequest<ExtensivPurchaseOrder>(
    {
      clientName,
      requestName: "extensiv.purchaseOrders.get",
      method: "GET",
      url: `/inventory/pos/${purchaseOrderId}`,
    },
    "EXT_0017",
    "Failed to fetch Extensiv purchase order"
  );
  return {
    data: res.data,
    etag: res.headers.etag,
  };
};

export const createPurchaseOrder = async (
  clientName: string,
  data: CreatePurchaseOrderData
): Promise<ExtensivCreatePurchaseOrderResponse> => {
  const res = await tryHandleRequest<ExtensivCreatePurchaseOrderResponse>(
    {
      clientName,
      requestName: "extensiv.purchaseOrders.create",
      method: "POST",
      url: `/inventory/pos`,
      data,
    },
    "EXT_0018",
    "Failed to create Extensiv purchase order"
  );
  return res.data;
};

export const updatePurchaseOrder = async (
  clientName: string,
  purchaseOrderId: number,
  etag: string,
  data: UpdatePurchaseOrderData
): Promise<ExtensivCreatePurchaseOrderResponse> => {
  const res = await tryHandleRequest<ExtensivCreatePurchaseOrderResponse>(
    {
      clientName,
      requestName: "extensiv.purchaseOrders.update",
      method: "PUT",
      url: `/inventory/pos/${purchaseOrderId}`,
      data,
      headers: { "If-Match": etag },
    },
    "EXT_0019",
    "Failed to update Extensiv purchase order"
  );
  return res.data;
};

/**
 * `etag` comes from `getPurchaseOrder` — see
 * docs/extensiv-api.md#if-match-on-the-mutating-endpoints.
 */
export const deletePurchaseOrder = async (
  clientName: string,
  purchaseOrderId: number,
  etag: string
) => {
  await tryHandleRequest(
    {
      clientName,
      requestName: "extensiv.purchaseOrders.delete",
      method: "DELETE",
      url: `/inventory/pos/${purchaseOrderId}`,
      headers: { "If-Match": etag },
    },
    "EXT_0020",
    "Failed to delete Extensiv purchase order"
  );
};
