import handleSpapiRequest from "../handleSpapiRequest.js";
import { QueryData } from "../types.js";
import {
  CancelReportData,
  CancelReportScheduleData,
  CreateReportData,
  CreateReportResponse,
  CreateReportScheduleData,
  CreateReportScheduleResponse,
  GetReportData,
  GetReportDocumentData,
  GetReportScheduleData,
  GetReportSchedulesData,
  GetReportSchedulesResponse,
  GetReportsData,
  GetReportsResponse,
  Report,
  ReportSchedule,
} from "./types.js";

export const createReport = async (
  data: CreateReportData
): Promise<CreateReportResponse> => {
  const res = await handleSpapiRequest<CreateReportResponse>(
    data.clientName,
    data.awsRegion,
    "AMZ_0014",
    "Failed to create Amazon report",
    {
      endpoint: "reportsCreateReport",
      url: "/reports/2021-06-30/reports",
      data: data.reportBody,
    },
    "amazonSpapi.reports.createReport"
  );
  return res.data;
};

export const getReport = async (data: GetReportData): Promise<Report> => {
  const res = await handleSpapiRequest<Report>(
    data.clientName,
    data.awsRegion,
    "AMZ_0015",
    "Failed to get Amazon report",
    {
      endpoint: "reportsGetReport",
      url: `/reports/2021-06-30/reports/${data.reportId}`,
    },
    "amazonSpapi.reports.getReport"
  );
  return res.data;
};

export const getReports = async (
  data: GetReportsData
): Promise<GetReportsResponse> => {
  const res = await handleSpapiRequest<GetReportsResponse>(
    data.clientName,
    data.awsRegion,
    "AMZ_0016",
    "Failed to get Amazon reports list",
    {
      endpoint: "reportsGetReports",
      url: `/reports/2021-06-30/reports`,
      params: data.reportBody as QueryData,
    },
    "amazonSpapi.reports.getReports"
  );
  return res.data;
};

export const cancelReport = async (data: CancelReportData): Promise<void> => {
  const res = await handleSpapiRequest<void>(
    data.clientName,
    data.awsRegion,
    "AMZ_0017",
    "Failed to cancel Amazon report",
    {
      endpoint: "reportsCancelReport",
      url: `/reports/2021-06-30/reports/${data.reportId}`,
    },
    "amazonSpapi.reports.cancelReport"
  );
  return res.data;
};

export const getReportSchedules = async (
  data: GetReportSchedulesData
): Promise<GetReportSchedulesResponse> => {
  const res = await handleSpapiRequest<GetReportSchedulesResponse>(
    data.clientName,
    data.awsRegion,
    "AMZ_0019",
    "Failed to get Amazon report schedules",
    {
      endpoint: "reportsGetReportSchedules",
      url: `/reports/2021-06-30/schedules`,
      params: { reportTypes: data.reportTypes },
    },
    "amazonSpapi.reports.getReportSchedules"
  );
  return res.data;
};

export const createReportSchedule = async (
  data: CreateReportScheduleData
): Promise<CreateReportScheduleResponse> => {
  const res = await handleSpapiRequest<CreateReportScheduleResponse>(
    data.clientName,
    data.awsRegion,
    "AMZ_0020",
    "Failed to create Amazon report schedule",
    {
      endpoint: "reportsCreateReportSchedule",
      url: `/reports/2021-06-30/schedules`,
      data: data.reportBody,
    },
    "amazonSpapi.reports.createReportSchedule"
  );
  return res.data;
};

export const getReportSchedule = async (
  data: GetReportScheduleData
): Promise<ReportSchedule> => {
  const res = await handleSpapiRequest<ReportSchedule>(
    data.clientName,
    data.awsRegion,
    "AMZ_0018",
    "Failed to get Amazon report schedule",
    {
      endpoint: "reportsGetReportSchedule",
      url: `/reports/2021-06-30/schedules/${data.reportScheduleId}`,
    },
    "amazonSpapi.reports.getReportSchedule"
  );
  return res.data;
};

export const cancelReportSchedule = async (
  data: CancelReportScheduleData
): Promise<void> => {
  const res = await handleSpapiRequest<void>(
    data.clientName,
    data.awsRegion,
    "AMZ_0021",
    "Failed to cancel Amazon report schedule",
    {
      endpoint: "reportsCancelReportSchedule",
      url: `/reports/2021-06-30/schedules/${data.reportScheduleId}`,
    },
    "amazonSpapi.reports.cancelReportSchedule"
  );
  return res.data;
};

export const getReportDocument = async (data: GetReportDocumentData) => {
  const res = await handleSpapiRequest(
    data.clientName,
    data.awsRegion,
    "AMZ_0022",
    "Failed to get Amazon report document",
    {
      endpoint: "reportsGetReportDocument",
      url: `/reports/2021-06-30/documents/${data.reportDocumentId}`,
    },
    "amazonSpapi.reports.getReportDocument"
  );
  return res.data;
};
