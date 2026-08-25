import handleQueryOptions from "../../handleQueryOptions.js";
import handleCaRequest from "../../handleCaRequest.js";
import { CAResultList } from "../../types.js";
import {
  GetProductChildrenOptions,
  RemoveProductChildrenData,
  Child,
} from "./types.js";

export const getProductChildren = async (
  clientName: string,
  productId: number,
  options?: GetProductChildrenOptions
): Promise<CAResultList<Child>> => {
  const query = handleQueryOptions(options);
  const res = await handleCaRequest<CAResultList<Child>>(
    {
      clientName,
      requestName: "channelAdvisor.productChildren.list",
      method: "GET",
      url: `/v1/Products(${productId})/Children${query}`,
    },
    "CHA_0017",
    "Failed to fetch Channel Advisor product children"
  );
  return res.data;
};

export const removeProductChildren = async (
  clientName: string,
  parentId: number,
  data: RemoveProductChildrenData
) => {
  await handleCaRequest(
    {
      clientName,
      requestName: "channelAdvisor.productChildren.remove",
      method: "POST",
      url: `/v1/Products(${parentId})/RemoveChildren`,
      data,
    },
    "CHA_0108",
    "Failed to remove Channel Advisor product children"
  );
};
