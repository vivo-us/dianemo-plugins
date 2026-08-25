import { tryHandleRequest } from "@dianemo/plugin-kit";
import { GetCustomersOptions } from "./types.js";

export const getCustomers = async (
  clientName: string,
  options?: GetCustomersOptions
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "extensiv.customers.list",
      method: "GET",
      url: `/customers`,
      params: options,
    },
    "EXT_0001",
    "Failed to fetch Extensiv customers"
  );
  return res.data;
};
