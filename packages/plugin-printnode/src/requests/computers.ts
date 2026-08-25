import { GetComputersResponse, RemoveComputersResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const getComputersById = async (
  clientName: string,
  computerId: number
): Promise<GetComputersResponse> => {
  const res = await tryHandleRequest<GetComputersResponse>(
    {
      clientName,
      requestName: "printNode.computers.get",
      method: "GET",
      url: `/computers/${computerId}`,
    },
    "PND_0001",
    "Failed to retrieve PrintNode computer by ID"
  );
  return res.data;
};

export const getAllComputers = async (
  clientName: string
): Promise<GetComputersResponse> => {
  const res = await tryHandleRequest<GetComputersResponse>(
    {
      clientName,
      requestName: "printNode.computers.list",
      method: "GET",
      url: "/computers",
    },
    "PND_0002",
    "Failed to retrieve all PrintNode computers"
  );
  return res.data;
};

/**
 * An undefined `computerId` interpolates as the literal "undefined" and 404s —
 * it does not fall through to `DELETE /computers`. Keep the path a template
 * literal: see docs/printnode-api.md#destructive-endpoints-are-scoped
 */
export const removeComputersById = async (
  clientName: string,
  computerId: number
): Promise<RemoveComputersResponse> => {
  const res = await tryHandleRequest<RemoveComputersResponse>(
    {
      clientName,
      requestName: "printNode.computers.delete",
      method: "DELETE",
      url: `/computers/${computerId}`,
    },
    "PND_0003",
    "Failed to remove PrintNode computer by ID"
  );
  return res.data;
};

export const removeAllComputers = async (
  clientName: string
): Promise<RemoveComputersResponse> => {
  const res = await tryHandleRequest<RemoveComputersResponse>(
    {
      clientName,
      requestName: "printNode.computers.deleteAll",
      method: "DELETE",
      url: "/computers",
    },
    "PND_0004",
    "Failed to remove all PrintNode computers"
  );
  return res.data;
};
