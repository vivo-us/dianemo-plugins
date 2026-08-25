import { OrderFile, OrderFilesSummary } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { ExtensivListOptions } from "../types.js";

/**
 * Extensiv's documented escape for a `.` in a file-name path segment, so
 * `label.pdf` is addressed as `label~d~pdf` — see
 * docs/extensiv-api.md#escaping-a-dot-in-a-file-name. Keep the order:
 * `encodeURIComponent` leaves `.` alone and runs before any `~` exists, so
 * neither step can undo the other.
 */
const encodeFileName = (fileName: string) =>
  encodeURIComponent(fileName).replace(/\./g, "~d~");

/**
 * Extensiv stores `contentType` verbatim and hands it back on `getFile`, so a
 * wrong value here is what a consumer of the file later sees.
 */
export const attachFile = async (
  clientName: string,
  orderId: string,
  base64: string,
  fileName: string,
  contentType: string
): Promise<OrderFile> => {
  const res = await tryHandleRequest<OrderFile>(
    {
      clientName,
      requestName: "extensiv.files.attach",
      // A query parameter rather than a path segment, so percent-encoding and
      // not `~d~` — see docs/extensiv-api.md#escaping-a-dot-in-a-file-name.
      url: `/orders/${orderId}/files?name=${encodeURIComponent(fileName)}`,
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Accept: "application/*",
      },
      data: Buffer.from(base64, "base64"),
    },
    "EXT_0003",
    "Failed to attach file to Extensiv order"
  );
  return res.data;
};

export const getFile = async (
  clientName: string,
  orderId: string,
  fileName: string
): Promise<OrderFile> => {
  const url = `/orders/${orderId}/files/${encodeFileName(fileName)}`;
  const res = await tryHandleRequest<OrderFile>(
    {
      clientName,
      requestName: "extensiv.files.get",
      method: "GET",
      url,
    },
    "EXT_0004",
    "Failed to fetch file from Extensiv order"
  );
  return res.data;
};

/** Extensiv flags the record deleted rather than destroying it. */
export const deleteFile = async (
  clientName: string,
  orderId: string,
  fileName: string
) => {
  const url = `/orders/${orderId}/files/${encodeFileName(fileName)}`;
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "extensiv.files.delete",
      method: "DELETE",
      url,
    },
    "EXT_0005",
    "Failed to delete file from Extensiv order"
  );
  return res.data;
};

export const getFiles = async (
  clientName: string,
  orderId: string,
  options?: ExtensivListOptions
): Promise<OrderFilesSummary> => {
  const url = `/orders/${orderId}/filesummaries`;
  const res = await tryHandleRequest<OrderFilesSummary>(
    {
      clientName,
      requestName: "extensiv.files.list",
      method: "GET",
      url,
      params: options,
    },
    "EXT_0006",
    "Failed to fetch files from Extensiv order"
  );
  return res.data;
};
