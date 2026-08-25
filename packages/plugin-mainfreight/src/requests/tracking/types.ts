export interface TrackServiceResponse {
  ourReference: string;
  yourReference: string;
  serviceType: string;
  trackingURL: string;
  relatedItems: RelatedItem[];
  carrierReferences: CarrierReference[];
  events: MainfreightTrackingEvent[];
}

export interface RelatedItem {
  type: string;
  value: string;
}

export interface CarrierReference {
  reference: string;
  carrierName: string;
  trackingUrl: string;
}

/** Not shortened to `Event`: the root barrel re-exports it, and a bare `Event` shadows the DOM global. */
export interface MainfreightTrackingEvent {
  sequence: number;
  eventDateTime: Date;
  code: string;
  displayName: string;
  location: string;
  isEstimated: boolean;
}
