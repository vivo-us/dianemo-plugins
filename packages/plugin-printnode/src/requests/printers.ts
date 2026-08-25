import { tryHandleRequest } from "@dianemo/plugin-kit";
import { GetPrintersResponse } from "./types.js";

export const getPrintersById = async (
  clientName: string,
  printerId: number
): Promise<GetPrintersResponse> => {
  const res = await tryHandleRequest<GetPrintersResponse>(
    {
      clientName,
      requestName: "printNode.printers.get",
      method: "GET",
      url: `/printers/${printerId}`,
    },
    "PND_0005",
    "Failed to retrieve printer by ID from PrintNode"
  );
  return res.data;
};

export const getAllPrinters = async (
  clientName: string
): Promise<GetPrintersResponse> => {
  const res = await tryHandleRequest<GetPrintersResponse>(
    {
      clientName,
      requestName: "printNode.printers.list",
      method: "GET",
      url: "/printers",
    },
    "PND_0006",
    "Failed to retrieve all printers from PrintNode"
  );
  return res.data;
};

export const getComputerPrintersById = async (
  clientName: string,
  computerId: number,
  printerId: number
): Promise<GetPrintersResponse> => {
  const url = `/computers/${computerId}/printers/${printerId}`;
  const res = await tryHandleRequest<GetPrintersResponse>(
    {
      clientName,
      requestName: "printNode.printers.getForComputer",
      method: "GET",
      url,
    },
    "PND_0007",
    "Failed to retrieve computer-specific printer by ID from PrintNode"
  );
  return res.data;
};

export const getAllComputerPrinters = async (
  clientName: string,
  computerId: number
): Promise<GetPrintersResponse> => {
  const url = `/computers/${computerId}/printers`;
  const res = await tryHandleRequest<GetPrintersResponse>(
    {
      clientName,
      requestName: "printNode.printers.listForComputer",
      method: "GET",
      url,
    },
    "PND_0008",
    "Failed to retrieve all printers for computer from PrintNode"
  );
  return res.data;
};
