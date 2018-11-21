export interface AvaiabilityInquiryLine {
  lineId: number;
  itemId: string;
  unitOfMeasure?: string;
  productClass?: string;
  deliveryMethod?: string;
  shipNodes?: string[];
};

export interface AvailabilityInquiry {
  distributionGroupId?: string;
  shipnodeId?: string;
  segment?: string;
  segmentType?: string;
  lines: AvaiabilityInquiryLine[];
}

// export interface NetworkAvailability {

//   lines: NetworkAvailabilityLine[];
// };

// export interface NetworkAvailabilityLine {
//   lineId: number;
//   networkAvailabilities: NetworkAvailabilityLineDetail[];
// }

export interface NetworkAvailabilityLineDetail {
  alertLevel: number;
  alertQuantity: number;
  distributionGroupId: string;
  earliestShipTs: string;
  futureAvailableQuantity: number;
  futureEarliestShipTs: string;
  futureLatestShipTs: string;
  onhandAvailableQuantity: number;
  onhandEarliestShipTs: string;
  onhandLatestShipTs: string;
  thresholdLevel: number;
  thresholdQuantity: number;
  totalAvailableQuantity: number;
}

// export interface ShipnodeAvailability {

//   lines: ShipnodeAvailabilityLine[];
// };

// export interface ShipnodeAvailabilityLine {
//   lineId: number;
//   shipNodeAvailability: ShipnodeAvailabilityLineDetail[];
// }

export interface ShipnodeAvailabilityLineDetail {
  earliestShipTs: string;
  futureAvailableQuantity: number;
  futureEarliestShipTs: string;
  futureLatestShipTs: string;
  latestShipTs: string;
  onhandAvailableQuantity: number;
  onhandEarliestShipTs: string;
  onhandLatestShipTs: string;
  shipNode: string;
  totalAvailableQuantity: number;
}

export interface AvailabilityResult {
  inquiryHeader?: AvailabilityInquiry;
  lines: [
    {
      lineId: number;
      inquiryLine?: AvaiabilityInquiryLine;
      shipNodeAvailability?: ShipnodeAvailabilityLineDetail[];
      networkAvailabilities?: NetworkAvailabilityLineDetail[];
    }
  ];
}


export class AvailabilityDataService {

  constructor() { }
}
