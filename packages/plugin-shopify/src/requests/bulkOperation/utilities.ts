import { ShopifyCreateBulkOperationResponse } from "./types.js";
import { RequestError } from "@dianemo/core";
import shopify from "../index.js";

/**
 * `undefined` is unreachable in practice: a completed operation always carries a
 * JSONL URL, and every other terminal state throws.
 */
export const shopifyPollBulkOperationUtility = async (
  clientName: string,
  data: ShopifyCreateBulkOperationResponse,
  timeout: number = 600000
) => {
  const { bulkOperation, userErrors } = data.bulkOperationRunQuery;
  // Shopify answers a refused bulk query with `bulkOperation: null` and a
  // populated `userErrors` — most often because the shop already has one running,
  // since it permits exactly one at a time. Reading `.id` straight off it threw a
  // `TypeError` that replaced the vendor's reason with a stack trace.
  if (!bulkOperation) {
    throw new RequestError(
      "SHO_0052",
      "Shopify did not start the bulk operation",
      {
        metadata: {
          context:
            userErrors.map((err) => err.message).join(", ") ||
            "Shopify returned no bulk operation and no error",
        },
      }
    );
  }
  let operationStatus = bulkOperation.status;
  const operationId = bulkOperation.id;
  let timeWaited = 0;
  let jsonURL;
  do {
    const status = await shopify.bulkOperation.getStatus(
      clientName,
      operationId
    );
    // Null when the id resolves to nothing, which for an operation we just
    // started means Shopify expired it out from under us.
    if (!status.data.node) {
      throw new RequestError("SHO_0053", "Shopify bulk operation not found", {
        metadata: { context: operationId },
      });
    }
    operationStatus = status.data.node.status;
    if (operationStatus === "COMPLETED") {
      jsonURL = status.data.node.url;
    } else if (["FAILED", "CANCELED", "EXPIRED"].includes(operationStatus)) {
      throw new RequestError(
        "SHO_0051",
        "Shopify bulk operation failed or was cancelled",
        {
          metadata: {
            context: `Bulk operation ended with status: ${operationStatus}, error code: ${status.data.node.errorCode}`,
          },
        }
      );
    } else {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      timeWaited += 5000;
      if (timeWaited >= timeout) {
        throw new RequestError("SHO_0049", "Shopify bulk operation timed out", {
          metadata: {
            context: `Bulk operation timed out after ${timeout} ms with status: ${operationStatus}`,
          },
        });
      }
    }
  } while (operationStatus !== "COMPLETED");

  return jsonURL;
};
