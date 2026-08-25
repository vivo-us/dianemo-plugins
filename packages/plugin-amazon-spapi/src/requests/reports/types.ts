import { AmazonMarketplaceId, AwsRegion } from "../../utils/amazonSpapiData.js";

enum ProcessingStatus {
  IN_QUEUE = "IN_QUEUE",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  DONE = "DONE",
  FATAL = "FATAL",
}

enum Period {
  EVERY_FIVE_MINUTES = "PT5M",
  EVERY_FIFTEEN_MINUTES = "PT15M",
  EVERY_THIRTY_MINUTES = "PT30M",
  EVERY_HOUR = "PT1H",
  EVERY_TWO_HOURS = "PT2H",
  EVERY_FOUR_HOURS = "PT4H",
  EVERY_EIGHT_HOURS = "PT8H",
  EVERY_TWELVE_HOURS = "PT12H",
  EVERY_EIGHTY_FOUR_HOURS = "PT84H",
  EVERY_DAY = "P1D",
  EVERY_TWO_DAYS = "P2D",
  EVERY_THREE_DAYS = "P3D",
  EVERY_SEVEN_DAYS = "P7D",
  EVERY_FOURTEEN_DAYS = "P14D",
  EVERY_FIFTEEN_DAYS = "P15D",
  EVERY_EIGHTEEN_DAYS = "P18D",
  EVERY_THIRTY_DAYS = "P30D",
  EVERY_MONTH = "P1M",
}

export enum ReportDocumentFormat {
  CSV = "csv",
  TSV = "tsv",
  JSON = "json",
  XML = "xml",
  PDF = "pdf",
  XLSX = "xlsx",
}

export interface AmazonJobStatusBaseType {
  marketplaceIds?: AmazonMarketplaceId[];
  processingStatus: ProcessingStatus;
  processingStartTime?: string;
  createdTime: string;
  processingEndTime?: string;
}

export interface Report extends AmazonJobStatusBaseType {
  reportId: string;
  reportType: string;
  dataStartTime?: string;
  dataEndTime?: string;
  reportScheduleId?: string;
  reportDocumentId?: string;
}

export interface ReportSchedule {
  reportScheduleId: string;
  reportType: string;
  period: Period;
  marketplaceIds?: AmazonMarketplaceId[];
  reportOptions?: Record<string, string>;
  nextReportCreationTime?: string;
}

interface CreateReportBody {
  reportType: string;
  marketplaceIds: AmazonMarketplaceId[];
  dataStartTime?: string;
  dataEndTime?: string;
  reportOptions?: Record<string, string>;
}

export interface CreateReportData {
  clientName: string;
  awsRegion: AwsRegion;
  reportBody: CreateReportBody;
}

export interface CreateReportResponse {
  reportId: string;
}

export interface GetReportData {
  clientName: string;
  awsRegion: AwsRegion;
  reportId: string;
}

interface GetReportsQuery {
  [reportTypes: string]:
    string | number | boolean | string[] | number[] | undefined;
  reportTypes?: string[];
  processingStatuses?: ProcessingStatus[];
  marketplaceIds?: AmazonMarketplaceId[];
  pageSize?: number;
  createdSince?: string;
  createdUntil?: string;
  nextToken?: string;
}

export interface GetReportsData {
  clientName: string;
  awsRegion: AwsRegion;
  reportBody: GetReportsQuery;
}

export interface GetReportsResponse {
  reports: Report[];
  nextToken?: string;
}

export interface CancelReportData {
  clientName: string;
  awsRegion: AwsRegion;
  reportId: string;
}

export interface GetReportSchedulesData {
  clientName: string;
  awsRegion: AwsRegion;
  reportTypes: string[];
}

export interface GetReportSchedulesResponse {
  reportSchedules: ReportSchedule[];
}

interface CreateReportScheduleBody {
  reportType: string;
  period: Period;
  marketplaceIds: AmazonMarketplaceId[];
  reportOptions?: Record<string, string>;
  nextReportCreationTime?: string;
}

export interface CreateReportScheduleData {
  clientName: string;
  awsRegion: AwsRegion;
  reportBody: CreateReportScheduleBody;
}

export interface CreateReportScheduleResponse {
  reportScheduleId: string;
}

export interface GetReportScheduleData {
  clientName: string;
  awsRegion: AwsRegion;
  reportScheduleId: string;
}

export interface CancelReportScheduleData {
  clientName: string;
  awsRegion: AwsRegion;
  reportScheduleId: string;
}

export interface GetReportDocumentData {
  clientName: string;
  awsRegion: AwsRegion;
  reportDocumentId: string;
  reportDocumentFormat: ReportDocumentFormat;
}
