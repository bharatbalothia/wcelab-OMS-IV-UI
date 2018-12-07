import { Injectable } from '@angular/core';
import { IvServiceBase } from '../iv-service-base.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../http-error-handler.service';
import { CredentialDataService, IVCredent } from '../credential/credential-data.service';
import { EntityUrl } from '../entity-url';
import { Observable } from 'rxjs';


export interface ReservationRequest {
  reference:    string | null;
  segment?:      string | null;
  segmentType?:  string | null;
  timeToExpire?: number | null;
  lines: ReservationRequestLine[];
}

export enum ReserveMode{
  DistGroup,
  ShipNode
}

export interface ReservationRequestLine {
  deliveryMethod:    string;
  distributionGroup?: string | null;
  itemId:            string | null;
  lineId:            string;
  productClass:      string;
  quantity:          number;
  shipNode?:          string | null;
  unitOfMeasure:     string;
  requestMode?:  ReserveMode;
}

export interface ReservationRequestResultLine {
  lineId:           string;
  reservationId:    string;
  reservedQuantity: number;
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
export class ReservationDataService extends IvServiceBase {

  constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);}

  protected getEntityUrl = (): string => { return EntityUrl.RESERVATIONS; }

  protected getBearerToken = (credential: IVCredent): string  => {
    return credential == null ? null : credential.tokens.reservations; 
  }

  createReservation(reservationRequest: ReservationRequest): Observable<ReservationRequestResultLine[]>{
    return this.postObject(reservationRequest);
  }
}
