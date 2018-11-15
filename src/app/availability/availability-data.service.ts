

export interface AvaiabilityInquiryLine {
  lineId: number;
  itemId: string;
  unitOfMeasure?: string;
  productClass?: string;
  deliveryMethod?: string;
  shipNodes?: string[];
};

export interface AvaiabilityInquiry {
  distributionGroupId?: string;
  segment?: string;
  segmentType?: string;
  lines: AvaiabilityInquiryLine[];
}

export interface AvailabilityResult {
  
  lines: AvaiabilityResultLine[];
};

export interface AvaiabilityResultLine{
  lineId: number;
  itemId: string;
  unitOfMeasure?: string;
  productClass?: string;
  deliveryMethod?: string;
  shipNodes?: string[];
  quantity?: number;
}

export class AvailabilityDataService  {

  constructor() { }
}
