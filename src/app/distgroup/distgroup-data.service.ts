import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import {IvServiceBase} from "../iv-service-base.service";

import {EntityUrl} from "../entity-url";

import {IVCredent, CredentialDataService} from "../credential/credential-data.service";

export interface DGShipNode {
  shipNode: string;
}

export interface DistributionGroup {
  distributionGroupId: string;
  // description: string;
  shipNodes: DGShipNode[];
}


@Injectable({
  providedIn: 'root'
})
export class DistgroupDataService extends IvServiceBase {

  distgroupSubject: BehaviorSubject<DistributionGroup[]> = new BehaviorSubject<DistributionGroup[]>([]);

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  public getEntityUrl = () => { return EntityUrl.CONFIGURATION_DISTRIBUTIONGROUPS; }

  public getBearerToken = (credential: IVCredent)  => {
    return credential == null ? null : credential.tokens.configurationDistributionGroups; 
  }

  getDistgroupList() : Observable<DistributionGroup[]> {
    return this.distgroupSubject;
  }

  retrieveAllDistgroups(): void {
    this.getList<DistributionGroup>().subscribe(data =>{
      this.populateDistgroupDetail(data);
      this.distgroupSubject.next(data);
    });
  }

  putDistgroup(distgroupToPut: DistributionGroup): void {
    this.putObject<DistributionGroup>(distgroupToPut, '/' + encodeURIComponent(distgroupToPut.distributionGroupId));
  }

  deleteDistgroup(distgroupToDelete: DistributionGroup): void {
    this.deleteObject('/' + encodeURIComponent(distgroupToDelete.distributionGroupId));
  }

  private populateDistgroupDetail(distgroups: DistributionGroup[]): void {
    for (let dg of distgroups){
      this.getObject('/' + encodeURIComponent(dg.distributionGroupId)).subscribe(data => {
        dg.shipNodes = [] as DGShipNode[];

        Object.assign(dg.shipNodes, data.shipNodes);
        
      });
    }
  }
}