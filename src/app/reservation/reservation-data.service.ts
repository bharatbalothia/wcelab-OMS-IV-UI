import { Injectable } from '@angular/core';


export interface ReservationRequest {
  reference:    string;
  segment:      string;
  segmentType:  string;
  timeToExpire: number;
  lines: ReservationRequestLine[];
}

export interface ReservationRequestLine {
  deliveryMethod:    string;
  distributionGroup: string;
  itemId:            string;
  lineId:            string;
  productClass:      string;
  quantity:          number;
  shipNode:          string;
  unitOfMeasure:     string;
}


export interface ReservationResponseLine {
  expirationTs:     string;
  id:               string;
  itemId:           string;
  productClass:     string;
  reference:        string;
  reservationTs:    string;
  reservedQuantity: number;
  status:           number;
  unitOfMeasure:    string;
}


export interface ReservationQuery {
  id: string;
  refernce: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationDataService {

  constructor() { }
}
