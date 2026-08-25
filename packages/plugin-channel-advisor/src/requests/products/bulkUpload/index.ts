import handleCaRequest from "../../handleCaRequest.js";
import { RequestError } from "@dianemo/core";
import {
  BulkProductUploadData,
  BulkProductUploadFormat,
  BulkProductUploadResponse,
  BulkProductUploadType,
} from "./types.js";

export const bulkProductUpdate = async (
  clientName: string,
  profileId: number,
  importType: BulkProductUploadType,
  data: BulkProductUploadData,
  templateCode?: string
): Promise<BulkProductUploadResponse> => {
  const contentType = getContentType(data.format);
  const res = await handleCaRequest<BulkProductUploadResponse>(
    {
      clientName,
      requestName: "channelAdvisor.productUpload.create",
      method: "POST",
      // Only the template code needs encoding: it is caller-supplied free text,
      // where the import type and profile id are ours.
      url: `/v1/ProductUpload?${
        templateCode ? `templatecode=${encodeURIComponent(templateCode)}&` : ""
      }importtype=${importType}&profileid=${profileId}`,
      headers: { "Content-Type": contentType },
      data: data.file,
    },
    "CHA_0096",
    "Failed to perform Channel Advisor bulk product update"
  );
  return res.data;
};

const getContentType = (format: BulkProductUploadFormat) => {
  if (format === "CSV") return "text/csv";
  if (format === "TAB") return "text/tab-separated-values";
  if (format === "XLSX")
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (format === "XML") return "text/xml";
  if (format === "GZIP") return "application/x-gzip";
  if (format === "TAR.GZ") return "application/x-tar-gzip";
  if (format === "ZIP") return "application/zip";
  throw new RequestError("CHA_0098", "Unsupported bulk product upload format", {
    metadata: { context: format },
  });
};

export const getBulkUploadStatus = async (
  clientName: string,
  token: string
): Promise<BulkProductUploadResponse> => {
  const res = await handleCaRequest<BulkProductUploadResponse>(
    {
      clientName,
      requestName: "channelAdvisor.productUpload.getStatus",
      method: "GET",
      // The token comes back from `bulkProductUpdate` opaque and base64-ish, so
      // it can carry a `+` — which in a query string decodes as a space, and
      // would be looked up as a token that does not exist.
      url: `/v1/ProductUpload?token=${encodeURIComponent(token)}`,
    },
    "CHA_0097",
    "Failed to fetch Channel Advisor bulk upload status"
  );
  return res.data;
};
