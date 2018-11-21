import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { HttpErrorHandler } from '../http-error-handler.service';

import { IvServiceBase } from "../iv-service-base.service";

import { EntityUrl } from "../entity-url";

import { IVCredent, CredentialDataService } from "../credential/credential-data.service";



export interface ItemSupply {
  organizationCode?: string;
  eta : string;
  itemId : string;
  lineReference? : string;
  productClass : string;
  quantity : number,
  reference? : string;
  referenceType? : string;
  segment? : string;
  segmentType? : string;
  shipByDate : string;
  shipNode : string;
  tagNumber? : string;
  type : string;
  unitOfMeasure : string;
  isNew?: boolean;
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

export interface ShipNodeSupply{
  shipNode: string;
  supplies: ItemSupply[];
}

@Injectable({
  providedIn: 'root'
})
export class SupplyDataService extends IvServiceBase {

  // distgroupSubject: BehaviorSubject<DistributionGroup[]> = new BehaviorSubject<DistributionGroup[]>([]);

  // private supplySubject: BehaviorSubject<ItemSupply[]> = new BehaviorSubject<ItemSupply[]>([]);

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  protected getEntityUrl = () => { return EntityUrl.SUPPLIES; }

  protected getBearerToken = (credential: IVCredent)  => {
    return credential == null ? null : credential.tokens.supplies; 
  }

  getSupply(query: SupplyQuery): Observable<ItemSupply[]> {

    // let supplySubject: BehaviorSubject<ItemSupply[]> = new BehaviorSubject<ItemSupply[]>([]);

    // this.getList<ItemSupply>('', query).subscribe(data => {
    //   console.debug('Received item supply from server.', data);
    //   supplySubject.next(data);
    // });

    return this.getList<ItemSupply>('', query);
  }


  /**
   * Sync supply to the list
   * @param suppliestoAdjust Array of supplies to sync server to
   */
  syncSupply(suppliestoAdjust: SupplyAdjustment[]): void {
    this.putObject<{supplies:SupplyAdjustment[]}>({
      supplies: suppliestoAdjust
    });
  }

}
