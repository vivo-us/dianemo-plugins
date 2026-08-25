import { tryHandleRequest } from "@dianemo/plugin-kit";
import { neweggSubClient } from "../utils.js";
import {
  NeweggGetOrdersFilters,
  NeweggGetOrdersData,
  NeweggGetOrdersResponse,
  NeweggMarkOrderDownloadedData,
  NeweggMarkOrderDownloadedResponse,
  NeweggShipOrderPackage,
  NeweggShipOrderData,
  NeweggShipOrderResponse,
} from "./types.js";

export const getOrders = async (
  clientName: string,
  filters: NeweggGetOrdersFilters
): Promise<NeweggGetOrdersResponse> => {
  const data: NeweggGetOrdersData = {
    OperationType: "GetOrderInfoRequest",
    RequestBody: filters,
  };
  const res = await tryHandleRequest<NeweggGetOrdersResponse>(
    {
      clientName: neweggSubClient(clientName, "getOrders"),
      requestName: "newegg.orders.list",
      method: "PUT",
      url: `/ordermgmt/order/orderinfo`,
      params: { version: 315 },
      data,
    },
    "NWG_0001",
    "Failed to get Newegg orders"
  );
  return res.data;
};

export const markOrderDownloaded = async (
  clientName: string,
  orderNumbers: string[]
) => {
  const data: NeweggMarkOrderDownloadedData = {
    OperationType: "OrderConfirmationRequest",
    RequestBody: {
      DownloadedOrderList: {
        OrderNumber: orderNumbers,
      },
    },
  };
  const res = await tryHandleRequest<NeweggMarkOrderDownloadedResponse>(
    {
      clientName: neweggSubClient(clientName, "markOrderDownloaded"),
      requestName: "newegg.orders.markDownloaded",
      method: "POST",
      url: `/ordermgmt/orderstatus/orders/confirmation`,
      data,
    },
    "NWG_0002",
    "Failed to mark Newegg order as downloaded"
  );
  return res.data.NeweggAPIResponse.ResponseBody;
};

export const shipOrder = async (
  clientName: string,
  orderNumber: string,
  packages: NeweggShipOrderPackage[],
  sellerId: string
): Promise<NeweggShipOrderResponse> => {
  const data: NeweggShipOrderData = {
    Action: "2",
    Value: {
      Shipment: {
        Header: {
          SellerID: sellerId,
          SONumber: Number(orderNumber),
        },
        PackageList: { Package: packages },
      },
    },
  };
  const res = await tryHandleRequest<NeweggShipOrderResponse>(
    {
      clientName: neweggSubClient(clientName, "shipOrder"),
      requestName: "newegg.orders.ship",
      method: "PUT",
      url: `/ordermgmt/orderstatus/orders/${orderNumber}`,
      params: { version: 304, ordernumber: orderNumber },
      data,
    },
    "NWG_0013",
    "Failed to ship Newegg order"
  );
  return res.data;
};
