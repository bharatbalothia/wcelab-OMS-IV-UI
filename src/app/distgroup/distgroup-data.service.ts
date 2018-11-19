import { Injectable, Output, EventEmitter } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, AsyncSubject, forkJoin, combineLatest, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import { IvServiceBase } from "../iv-service-base.service";

import { EntityUrl } from "../entity-url";

import { IVCredent, CredentialDataService } from "../credential/credential-data.service";
import { ShipnodeDataService, ShipNode } from '../shipnode/shipnode-data.service';

// export interface DGShipNode {
//   shipNode: string;
//   latitude?: number;
//   longitude?: number;
// }

export interface DistributionGroup {
  distributionGroupId: string;
  // description: string;
  shipNodes: ShipNode[];

  // center?: { latitude: number; longitude: number };
  // corners?: {south: number; west: number; north: number; east: number};
}


@Injectable({
  providedIn: 'root'
})
export class DistgroupDataService extends IvServiceBase {

  // distgroupSubject: AsyncSubject<DistributionGroup[]> = new AsyncSubject<DistributionGroup[]>();

  private retriveNeeded: boolean = true;

  // @Output() distgroupChangedEvent: EventEmitter<DistributionGroup[]>;

  constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService,
    private shipnodeDataService: ShipnodeDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  protected getEntityUrl = () => { return EntityUrl.CONFIGURATION_DISTRIBUTIONGROUPS; }

  protected getBearerToken = (credential: IVCredent) => {
    return credential == null ? null : credential.tokens.configurationDistributionGroups;
  }

  getDistgroupList(reloadDistgroups = false): Observable<DistributionGroup[]> {

    const distgroupSubject: AsyncSubject<DistributionGroup[]> = new AsyncSubject<DistributionGroup[]>();

    if (reloadDistgroups) {
      this.retriveNeeded = true;
      console.debug('User requested to reload distribution groups');
    }

    if (this.retriveNeeded) {
      this.retriveNeeded = false;
      console.debug('Requesting DGs from server.');
      this.retrieveAllDistgroups(distgroupSubject);
    }

    return distgroupSubject;
  }

  retrieveAllDistgroups(distgroupSubject: AsyncSubject<DistributionGroup[]>): void {
    this.getList<DistributionGroup>().subscribe(data => {
      this.populateAndPublishDistgroupDetail(distgroupSubject, data);
    });
  }

  putDistgroup(distgroupToPut: DistributionGroup): void {
    this.putObject<DistributionGroup>(distgroupToPut, '/' + encodeURIComponent(distgroupToPut.distributionGroupId));
  }

  deleteDistgroup(distgroupToDelete: DistributionGroup): void {
    this.deleteObject('/' + encodeURIComponent(distgroupToDelete.distributionGroupId));
  }



  private populateAndPublishDistgroupDetail(subjectToPublish: AsyncSubject<DistributionGroup[]>, distgroups: DistributionGroup[]): void {

    const dgSubscribers = [] as Observable<DistributionGroup | ShipNode[]>[];

    // First get the ship node list.
    const getShipnodeListObservable: Observable<ShipNode[]> = this.shipnodeDataService.getShipnodeList();

    dgSubscribers.push(getShipnodeListObservable);

    // The result from IV's get distribution group detail 
    // doesn't have distributiongroup id. Using a pipe to add it.
    const setDGId = (dgId) => map(value => {
      const dg: DistributionGroup = <DistributionGroup>value;
      dg.distributionGroupId = dgId;
      return dg;
    });

    // Then get each distribution group's ship node list
    distgroups.forEach((dg, index) => {
      
      const dgGetShipnodeListObservable =

        this.getObject('/' + encodeURIComponent(dg.distributionGroupId))
          .pipe(setDGId(dg.distributionGroupId));

      dgSubscribers.push(dgGetShipnodeListObservable);
    });

    // console.debug('Distributiongroup getter Observable array ready.', dgSubscribers);


    // Need to create the distribution list by 
    // 1. fill the DG list with the shipnodes in each DG
    // 2. set the shipnode detail for each DG Shipnode.
    // Using forkjoin to wait for all async requests to complete before
    // combining the data.
    //TODO: Should use forkJoin here to wait for all subscriber to finish. Don't know why
    // it doesn't come back. Have to use combineLatest for now.
    combineLatest(dgSubscribers).subscribe(emittingObjectList => {

      // console.debug('DG** All forkJoin Observables emitted.', emittingObjectList);

      const emittingListLength = emittingObjectList.length;

      var shipnodeList: ShipNode[];
      
      emittingObjectList.forEach((emitObj: DistributionGroup | ShipNode[], index: number) => {

        // console.debug('Received [%d/%d]:', index, emittingListLength, emitObj);

        if ((<DistributionGroup>emitObj).distributionGroupId) {
          // This is a distribution gorup
          const emitDG: DistributionGroup = <DistributionGroup>emitObj;

          const dgToEdit: DistributionGroup = distgroups.find(dg => dg.distributionGroupId == emitDG.distributionGroupId);
          // Copy the shipnodes into the dg in the data array
          dgToEdit.shipNodes = [] as ShipNode[];
          Object.assign(dgToEdit.shipNodes, emitDG.shipNodes)

          DistgroupDataService.populateShipnodeGeoInDG(dgToEdit, shipnodeList);
        } else {
          // This is emitted by the get ShipNode List and should come first.
          shipnodeList = <ShipNode[]>emitObj;
        }
      }); 

      // Now the list of distribution group is ready with the detail of each shipnodes in them
      console.debug('DG** Merged shipnode data into DGs.', distgroups);

      subjectToPublish.next(distgroups);

      subjectToPublish.complete();

    });

  }

  public static populateShipnodeGeoInDG(dgWithoutShipnodeGeo: DistributionGroup, shipnodeList: ShipNode[]) {
    dgWithoutShipnodeGeo.shipNodes.forEach((dgshipnode) => {
      const shipnodeFromList: ShipNode = shipnodeList.find(shipnode => shipnode.shipNode == dgshipnode.shipNode);
      // shipnodeFromList could be null if the shipnode was deleted but not removed from dg.
      dgshipnode.latitude = shipnodeFromList ? shipnodeFromList.latitude : null;
      dgshipnode.longitude = shipnodeFromList ? shipnodeFromList.longitude : null;
    });
  }
}
