export type BulkProductUploadType =
  "AddUpdate" | "UpdateOnly" | "AddOnly" | "DetectDropItems";

export type BulkProductUploadFormat =
  "CSV" | "TAB" | "XLSX" | "XML" | "GZIP" | "TAR.GZ" | "ZIP";

export type BulkProductUploadStatus =
  | "Aborted"
  | "AbortedAcknowledged"
  | "AcknowledgedNotVisible"
  | "Complete"
  | "CompleteWithErrors"
  | "CompleteWithSystemicErrors"
  | "DeletedReadyForRemoval"
  | "FailedValidation"
  | "InProgress"
  | "InProgressPartitioning"
  | "InProgressProcessing"
  | "InProgressQueuedforProcessing"
  | "InProgressValidation"
  | "Pending"
  | "PendingPartitioning"
  | "Requeue"
  | "SelectedForPartitioning"
  | "SystemicFailure";

export interface BulkProductUploadData {
  format: BulkProductUploadFormat;
  file: string;
}

export interface BulkProductUploadResponse {
  $id: string;
  Token: string;
  Status: BulkProductUploadStatus;
  StartedOnUtc: string;
  ResponseFileUrl: string | null;
}
