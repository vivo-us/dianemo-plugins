import { tryHandleRequest } from "@dianemo/plugin-kit";
import { Account } from "./types.js";

export const whoAmI = async (clientName: string): Promise<Account> => {
  const res = await tryHandleRequest<Account>(
    {
      clientName,
      requestName: "printNode.account.whoAmI",
      method: "GET",
      url: "/whoami",
    },
    "PND_0000",
    "Failed to retrieve PrintNode account information"
  );
  return res.data;
};
