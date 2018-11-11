import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { HttpErrorHandler } from '../http-error-handler.service';

import { IvServiceBase } from "../iv-service-base.service";

import { EntityUrl } from "../entity-url";

import { IVCredent, CredentialDataService } from "../credential/credential-data.service";



export interface ItemSupply {
  itemId: string;
  unitOfMeasure: string;
  productClass: string;
  organizationCode: string;
  shipNode: string;
  type: string;
  quantity: number;
  shipByDate: string;
}

export interface SupplyQuery {
  itemId: string;
  unitOfMeasure: string;
  productClass: string;
  shipNode: string;
}

export interface SupplyAdjustment {
  eta: string;
  itemId: string;
  lineReference: string;
  productClass: string;
  quantity: number;
  reference: string;
  referenceType: string;
  segment: string;
  segmentType: string;
  shipByDate: string;
  shipNode: string;
  sourceTs: string;
  tagNumber: string;
  type: string;
  unitOfMeasure: string;
}


@Injectable({
  providedIn: 'root'
})
export class SupplyDataService extends IvServiceBase {

  // distgroupSubject: BehaviorSubject<DistributionGroup[]> = new BehaviorSubject<DistributionGroup[]>([]);

  private supplySubject: BehaviorSubject<ItemSupply[]> = new BehaviorSubject<ItemSupply[]>([]);

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  public getEntityUrl = () => { return EntityUrl.SUPPLIES; }

  public getBearerToken = (credential: IVCredent)  => {
    return credential == null ? null : credential.tokens.supplies; 
  }

  getSupply(query: SupplyQuery): Observable<ItemSupply[]> {


    this.getList<ItemSupply>('', query).subscribe(data => {
      console.debug('Received item supply from server.', data);
      this.supplySubject.next(data);
    });

    return this.supplySubject;
  }

  putSupplyAdjustment(supplytoAdjust: SupplyAdjustment): void {
    this.putObject<SupplyAdjustment>(supplytoAdjust);
  }

}
