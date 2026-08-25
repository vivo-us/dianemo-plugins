import { FedExResponse } from "../types.js";

export interface FedExCancelShipmentOptions {
  deleteAllPackages?: boolean;
}

export interface FedExCancelShipmentRequest {
  accountNumber: {
    value: string;
  };
  trackingNumber: string;
  deletionControl?: "DELETE_ALL_PACKAGES";
}

export type FedExCancelShipmentResponse =
  FedExResponse<FedExCancelShipmentOutput>;

interface FedExCancelShipmentOutput {
  cancelledShipment?: boolean;
  cancelledHistory?: boolean;
  successMessage?: string;
}
