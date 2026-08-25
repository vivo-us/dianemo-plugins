import { AmazonJobStatusBaseType } from "../reports/types.js";

type AmazonFeedTypes =
  | "JSON_LISTINGS_FEED"
  | "POST_PRODUCT_DATA"
  | "POST_INVENTORY_AVAILABILITY_DATA"
  | "POST_PRODUCT_OVERRIDES_DATA"
  | "POST_PRODUCT_PRICING_DATA"
  | "POST_PRODUCT_IMAGE_DATA"
  | "POST_PRODUCT_RELATIONSHIP_DATA"
  | "POST_FLAT_FILE_INVLOADER_DATA"
  | "POST_FLAT_FILE_LISTINGS_DATA"
  | "POST_FLAT_FILE_BOOKLOADER_DATA"
  | "POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA"
  | "POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA"
  | "POST_UIEE_BOOKLOADER_DATA"
  | "POST_STD_ACES_DATA"
  | "POST_ORDER_ACKNOWLEDGEMENT_DATA"
  | "POST_PAYMENT_ADJUSTMENT_DATA"
  | "POST_ORDER_FULFILLMENT_DATA"
  | "POST_INVOICE_CONFIRMATION_DATA"
  | "POST_EXPECTED_SHIP_DATE_SOD"
  | "POST_FLAT_FILE_ORDER_ACKNOWLEDGEMENT_DATA"
  | "POST_FLAT_FILE_PAYMENT_ADJUSTMENT_DATA"
  | "POST_FLAT_FILE_ORDER_FULFILLMENT_DATA"
  | "POST_EXPECTED_SHIP_DATE_SOD_FLAT_FILE"
  | "POST_FULFILLMENT_ORDER_REQUEST_DATA"
  | "POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA"
  | "POST_FBA_INBOUND_CARTON_CONTENTS"
  | "POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA"
  | "POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA"
  | "POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN"
  | "POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN"
  | "POST_FLAT_FILE_FBA_CREATE_REMOVAL"
  | "RFQ_UPLOAD_FEED"
  | "POST_EASYSHIP_DOCUMENTS"
  | "UPLOAD_VAT_INVOICE";

export interface CreateFeedSpecification {
  feedType: AmazonFeedTypes;
  marketplaceIds: string[];
  inputFeedDocumentId: string;
  feedOptions?: Record<string, unknown>;
}

export interface AmazonFeedsXMLToJSON {
  "?xml": string;
  AmazonEnvelope: {
    Header: {
      DocumentVersion: string;
      MerchantIdentifier: string;
    };
    MessageType: string;
    Message: {
      MessageID: number;
      ProcessingReport: {
        DocumentTransactionID: number;
        StatusCode: string;
        ProcessingSummary: {
          MessagesProcessed: number;
          MessagesSuccessful: number;
          MessagesWithError: number;
          MessagesWithWarning: number;
        };
        Result: {
          MessageID: number;
          ResultCode: string;
          ResultMessageCode: number;
          ResultDescription: string;
        };
      };
    };
  };
}

type AmazonFeedMessageJSON<T = object> = {
  messageId: number;
} & T;

type AmazonFeedPatchesJSON<T = object> = {
  op: string | "replace";
  path: string;
  value: T[];
};
export interface AmazonUpdateFeedJSON<
  MessageType = object,
  PatchValues = object,
> {
  header: {
    sellerId: string;
    version: string;
    issueLocale: string;
  };
  messages: AmazonFeedMessageJSON<MessageType>[];
  patches?: AmazonFeedPatchesJSON<PatchValues>[];
}

export interface AmazonFeedDocumentResponse {
  feedDocumentId: string;
  url: string;
  compressionAlgorithm?: string;
}
export interface AmazonFeedData extends AmazonJobStatusBaseType {
  feedId: string;
  feedType: AmazonFeedTypes;
  resultFeedDocumentId: string;
}

export interface AmazonFeedStatus {
  data: string;
}

export interface AmazonCreateFeedResponse {
  feedId: string;
}

export type AmazonFeedDataType =
  "text/xml; charset=UTF-8" | "application/json; charset=UTF-8";
