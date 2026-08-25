import { SearchUnisReceiptsDataResponse, UnisReceiptItem } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { UnisSearchCreatedData } from "../types.js";
import {
  UnisSearchUpdatedData,
  UnisSearchUpdatedDataResponse,
} from "../types.js";

export const getReceiptsItems = async (
  clientName: string,
  data: UnisSearchUpdatedData
): Promise<UnisSearchUpdatedDataResponse<UnisReceiptItem>> => {
  const res = await tryHandleRequest<
    UnisSearchUpdatedDataResponse<UnisReceiptItem>
  >(
    {
      clientName,
      requestName: "unis.receipts.listItems",
      method: "POST",
      url: "/edi/inbound/receipt-item-level/search-by-paging",
      data,
    },
    "UNS_0012",
    "Failed to fetch UNIS receipt items"
  );
  return res.data;
};

export const searchReceipts = async (
  clientName: string,
  data: UnisSearchCreatedData
): Promise<SearchUnisReceiptsDataResponse> => {
  const res = await tryHandleRequest<SearchUnisReceiptsDataResponse>(
    {
      clientName,
      requestName: "unis.receipts.search",
      method: "POST",
      url: "/edi/inbound/receipt/rc/search-by-paging",
      data,
    },
    "UNS_0013",
    "Failed to search UNIS receipts"
  );
  return res.data;
};
