import { WalmartReturn, GetWalmartReturnsData } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";

export const getWalmartReturns = async (
  clientName: string,
  data: GetWalmartReturnsData
) => {
  const { filters, nextCursor } = data;
  if (filters && nextCursor) {
    throw new RequestError(
      "WMT_0003",
      "Cannot provide both filters and nextCursor for Walmart returns",
      {
        metadata: {
          filters: filters,
          nextCursor: nextCursor,
          context: "getWalmartReturns",
        },
      }
    );
  }

  const res = await tryHandleRequest<WalmartReturn>(
    {
      clientName,
      requestName: "walmart.returns.list",
      url: `/v3/returns${nextCursor ? nextCursor : ""}`,
      method: "GET",
      params: !nextCursor && filters,
    },
    "WMT_0004",
    "Failed to fetch Walmart returns"
  );

  return res.data;
};
