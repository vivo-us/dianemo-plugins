import { AmazonFeedDataType, AmazonUpdateFeedJSON } from "./types.js";
import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import {
  AmazonFeedDocumentResponse,
  AmazonFeedStatus,
  CreateFeedSpecification,
  AmazonFeedData,
  AmazonCreateFeedResponse,
} from "./types.js";

/**
 Feed best practices
 - Include only the data that is required for the feed type.
 - Identify the rate of feed submissions.  Only upload one feed of the same type no more than once every 20 minutes
 - Size of feed data is below 10 MiB
 - Adjust the feed processing rate to avoid exceeding the maximum request quota
 */

/**
 * @howto use Amazon Feeds
 * 1. Create a feed document
 * 2. Upload feed document to the url provided in previous step
 * 3. Call createFeed with the feed document id from step 1, specify marketplaceIds, and feed options
 * 4. Use checkFeedStatus to check the status of the feed
 * 5. Call getFeedDocument to get the url of the feed
 * 6. Download the feed from the url
 * 7. Check the feed for errors or success
 */

export const createFeedDocument = async (
  clientName: string,
  awsRegion: AwsRegion,
  contentType: AmazonFeedDataType,
  marketplaceIds: string[]
): Promise<{
  feedDocumentId: string;
  url: string;
}> => {
  const res = await handleSpapiRequest<{ feedDocumentId: string; url: string }>(
    clientName,
    awsRegion,
    "AMZ_0032",
    "Failed to create Amazon feed document",
    {
      endpoint: "feedsCreateFeedDocument",
      url: "/feeds/2021-06-30/documents",
      data: { marketplaceIds, contentType },
    },
    "amazonSpapi.feeds.createFeedDocument"
  );
  return res.data;
};

export const createFeed = async (
  clientName: string,
  awsRegion: AwsRegion,
  body: CreateFeedSpecification
): Promise<AmazonCreateFeedResponse> => {
  const res = await handleSpapiRequest<AmazonCreateFeedResponse>(
    clientName,
    awsRegion,
    "AMZ_0002",
    "Failed to create Amazon feed",
    {
      endpoint: "feedsCreateFeed",
      url: "/feeds/2021-06-30/feeds",
      data: body,
    },
    "amazonSpapi.feeds.createFeed"
  );
  return res.data;
};

export const getFeedDocument = async (
  clientName: string,
  awsRegion: AwsRegion,
  feedDocumentId: string
): Promise<AmazonFeedDocumentResponse> => {
  const res = await handleSpapiRequest<AmazonFeedDocumentResponse>(
    clientName,
    awsRegion,
    "AMZ_0003",
    "Failed to get Amazon feed document",
    {
      endpoint: "feedsGetFeedDocument",
      url: `/feeds/2021-06-30/documents/${feedDocumentId}`,
    },
    "amazonSpapi.feeds.getFeedDocument"
  );
  return res.data;
};

export const getFeed = async (
  clientName: string,
  awsRegion: AwsRegion,
  feedId: string
): Promise<AmazonFeedData> => {
  const res = await handleSpapiRequest<AmazonFeedData>(
    clientName,
    awsRegion,
    "AMZ_0004",
    "Failed to get Amazon feed",
    {
      endpoint: "feedsGetFeed",
      url: `/feeds/2021-06-30/feeds/${feedId}`,
    },
    "amazonSpapi.feeds.getFeed"
  );
  return res.data;
};

export const getFeedStatus = async (
  feedDocumentURL: string
): Promise<AmazonFeedStatus> => {
  const res = await tryHandleRequest<AmazonFeedStatus>(
    {
      clientName: "default",
      requestName: "amazonSpapi.feeds.getFeedStatus",
      method: "GET",
      url: feedDocumentURL,
    },
    "AMZ_0034",
    "Failed to get Amazon feed status from document URL"
  );
  return res.data;
};

export const uploadFeedData = async (
  feedUrl: string,
  data: AmazonUpdateFeedJSON | string,
  contentType: AmazonFeedDataType
) => {
  // Its own code, separate from the upload failure below: this one is decided
  // here, before anything is sent, and the caller's fix is to split the feed
  // rather than to retry it.
  if (
    (typeof data === "object" && JSON.stringify(data).length > 10485760) ||
    (typeof data === "string" && data.length > 10485760)
  )
    throw new RequestError("AMZ_0072", "Feed data exceeds 10 MiB limit", {
      metadata: { context: "Feed data exceeds 10 MiB" },
    });

  await tryHandleRequest(
    {
      clientName: "default",
      requestName: "amazonSpapi.feeds.uploadFeedData",
      method: "PUT",
      url: feedUrl,
      data,
      headers: { "Content-Type": contentType },
    },
    "AMZ_0031",
    "Failed to upload Amazon feed data"
  );
};
