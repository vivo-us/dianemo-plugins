export interface AmazonGetNextPageReturnInterface {
  pagination?: {
    nextToken: string;
  };
  payload: {
    granularity: {
      granularityType: string;
      granularityId: string;
    };
    inventorySummaries: AmazonFbaInventorySummary[];
  };
}
export interface AmazonFbaInventorySummary {
  asin: string;
  fnSku: string;
  sellerSku: string;
  condition: string;
  inventoryDetails: {
    fulfillableQuantity: number;
    inboundWorkingQuantity: number;
    inboundShippedQuantity: number;
    inboundReceivingQuantity: number;
    reservedQuantity: {
      totalReservedQuantity: number;
      pendingCustomerOrderQuantity: number;
      pendingTransshipmentQuantity: number;
      fcProcessingQuantity: number;
    };
    researchingQuantity: {
      totalResearchingQuantity: number;
      researchingQuantityBreakdown: [];
    };
    unfulfillableQuantity: {
      totalUnfulfillableQuantity: number;
      customerDamagedQuantity: number;
      warehouseDamagedQuantity: number;
      distributorDamagedQuantity: number;
      carrierDamagedQuantity: number;
      defectiveQuantity: number;
      expiredQuantity: number;
    };
    futureSupplyQuantity: {
      reservedFutureSupplyQuantity: number;
      futureSupplyBuyableQuantity: number;
    };
  };
  lastUpdatedTime: string;
  productName: string;
  totalQuantity: number;
}
