import { ExtensivNamedId } from "../types.js";

export interface OrderFile {
  DocName: string;
  ContentType: string;
  DocLength: number;
  AttachedByIdentifier: ExtensivNamedId;
  AttachedDate: Date;
  /** Present only once the file has been flagged deleted. */
  RemovedByIdentifier?: ExtensivNamedId;
}

export interface OrderFilesSummary {
  ResourceList: OrderFile[];
}
