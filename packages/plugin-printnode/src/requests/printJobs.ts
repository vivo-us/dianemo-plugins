import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  ContentType,
  CreatePrintJobOptions,
  DeletePrintJobResponse,
  GetPrintJobStateResponse,
  GetPrintJobsResponse,
  PrintJobId,
} from "./types.js";

export const createPrintJob = async (
  clientName: string,
  printerId: number,
  contentType: ContentType,
  content: string,
  options?: CreatePrintJobOptions
): Promise<PrintJobId> => {
  const { idempotencyKey, printNodeOptions } = options || {};
  const data = {
    printerId: printerId,
    content: content,
    contentType: contentType,
    ...printNodeOptions,
  };
  const headers = {
    ...(idempotencyKey ? { "X-Idempotency-key": idempotencyKey } : {}),
  };
  const res = await tryHandleRequest<PrintJobId>(
    {
      clientName,
      requestName: "printNode.printJobs.create",
      method: "POST",
      url: "/printjobs",
      data,
      headers,
    },
    "PND_0009",
    "Failed to create print job on PrintNode"
  );
  return res.data;
};

export const getPrintJobsById = async (
  clientName: string,
  printJobId: number
): Promise<GetPrintJobsResponse> => {
  const res = await tryHandleRequest<GetPrintJobsResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.get",
      method: "GET",
      url: `/printjobs/${printJobId}`,
    },
    "PND_0010",
    "Failed to retrieve print job by ID from PrintNode"
  );
  return res.data;
};

export const getAllPrintJobs = async (
  clientName: string
): Promise<GetPrintJobsResponse> => {
  const res = await tryHandleRequest<GetPrintJobsResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.list",
      method: "GET",
      url: "/printjobs",
    },
    "PND_0011",
    "Failed to retrieve all print jobs from PrintNode"
  );
  return res.data;
};

export const getPrinterPrintJobsById = async (
  clientName: string,
  printerId: number,
  printJobId: number
): Promise<GetPrintJobsResponse> => {
  const url = `/printers/${printerId}/printjobs/${printJobId}`;
  const res = await tryHandleRequest<GetPrintJobsResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.getForPrinter",
      method: "GET",
      url,
    },
    "PND_0012",
    "Failed to retrieve printer-specific print job by ID from PrintNode"
  );
  return res.data;
};

export const getAllPrinterPrintJobs = async (
  clientName: string,
  printerId: number
): Promise<GetPrintJobsResponse> => {
  const url = `/printers/${printerId}/printjobs`;
  const res = await tryHandleRequest<GetPrintJobsResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.listForPrinter",
      method: "GET",
      url,
    },
    "PND_0013",
    "Failed to retrieve all print jobs for printer from PrintNode"
  );
  return res.data;
};

/**
 * An undefined id interpolates as the literal "undefined" and 404s — no scoped
 * delete in this file falls through to `DELETE /printjobs`. Keep the paths
 * template literals: see docs/printnode-api.md#destructive-endpoints-are-scoped
 */
export const deletePrintJobById = async (
  clientName: string,
  printJobId: number
): Promise<DeletePrintJobResponse> => {
  const res = await tryHandleRequest<DeletePrintJobResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.delete",
      method: "DELETE",
      url: `/printjobs/${printJobId}`,
    },
    "PND_0014",
    "Failed to delete print job by ID from PrintNode"
  );
  return res.data;
};

export const deleteAllPrintJobs = async (clientName: string) => {
  const res = await tryHandleRequest<DeletePrintJobResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.deleteAll",
      method: "DELETE",
      url: "/printjobs",
    },
    "PND_0015",
    "Failed to delete all print jobs from PrintNode"
  );
  return res.data;
};

export const deletePrinterPrintJobById = async (
  clientName: string,
  printerId: number,
  printJobId: number
): Promise<DeletePrintJobResponse> => {
  const url = `/printers/${printerId}/printjobs/${printJobId}`;
  const res = await tryHandleRequest<DeletePrintJobResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.deleteForPrinter",
      method: "DELETE",
      url,
    },
    "PND_0016",
    "Failed to delete printer-specific print job by ID from PrintNode"
  );
  return res.data;
};

export const deleteAllPrinterPrintJobs = async (
  clientName: string,
  printerId: number
): Promise<DeletePrintJobResponse> => {
  const url = `/printers/${printerId}/printjobs`;
  const res = await tryHandleRequest<DeletePrintJobResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.deleteAllForPrinter",
      method: "DELETE",
      url,
    },
    "PND_0017",
    "Failed to delete all print jobs for printer from PrintNode"
  );
  return res.data;
};

export const getPrintJobStates = async (
  clientName: string,
  printJobId: number
): Promise<GetPrintJobStateResponse> => {
  const url = `/printjobs/${printJobId}/states`;
  const res = await tryHandleRequest<GetPrintJobStateResponse>(
    {
      clientName,
      requestName: "printNode.printJobs.getStates",
      method: "GET",
      url,
    },
    "PND_0018",
    "Failed to retrieve print job states from PrintNode"
  );
  return res.data;
};
