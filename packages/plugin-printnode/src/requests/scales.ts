import { tryHandleRequest } from "@dianemo/plugin-kit";
import { GetScalesResponse } from "./types.js";

export const getComputerScalesById = async (
  clientName: string,
  computerId: number,
  deviceName: string
): Promise<GetScalesResponse> => {
  const url = `/computers/${computerId}/scales/${deviceName}`;
  const res = await tryHandleRequest<GetScalesResponse>(
    {
      clientName,
      requestName: "printNode.scales.getByDevice",
      method: "GET",
      url,
    },
    "PND_0019",
    "Failed to retrieve scale by device name from PrintNode"
  );
  return res.data;
};

export const getAllComputerScales = async (
  clientName: string,
  computerId: number
): Promise<GetScalesResponse> => {
  const url = `/computers/${computerId}/scales`;
  const res = await tryHandleRequest<GetScalesResponse>(
    {
      clientName,
      requestName: "printNode.scales.listForComputer",
      method: "GET",
      url,
    },
    "PND_0020",
    "Failed to retrieve all scales for computer from PrintNode"
  );
  return res.data;
};

export const getScaleDetails = async (
  clientName: string,
  computerId: number,
  deviceName: string,
  deviceNumber: number
): Promise<GetScalesResponse> => {
  const url = `/computers/${computerId}/scales/${deviceName}/${deviceNumber}`;
  const res = await tryHandleRequest<GetScalesResponse>(
    {
      clientName,
      requestName: "printNode.scales.getDetails",
      method: "GET",
      url,
    },
    "PND_0021",
    "Failed to retrieve specific scale details from PrintNode"
  );
  return res.data;
};

/**
 * Simulates one measurement from PrintNode's virtual scale — device 0, name
 * "PrintNode Test Scale", computer 0 — readable for 45 seconds afterwards
 * through every scale endpoint: docs/printnode-api.md#the-test-scale
 */
export const createTestScale = async (clientName: string): Promise<string> => {
  const res = await tryHandleRequest<string>(
    {
      clientName,
      requestName: "printNode.scales.createTest",
      method: "PUT",
      url: "/scale",
    },
    "PND_0022",
    "Failed to create test scale on PrintNode"
  );
  return res.data;
};
