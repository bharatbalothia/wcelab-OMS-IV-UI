import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, AsyncSubject, forkJoin, combineLatest, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import { IvServiceBase } from "../iv-service-base.service";

import { EntityUrl } from "../entity-url";

import { IVCredent, CredentialDataService } from "../credential/credential-data.service";
import { ShipnodeDataService, ShipNode } from '../shipnode/shipnode-data.service';

export interface DGShipNode {
  shipNode: string;
  latitude?: number;
  longitude?: number;
}

export interface DistributionGroup {
  distributionGroupId: string;
  // description: string;
  shipNodes: DGShipNode[];

  center?: { latitude: number; longitude: number };
  // corners?: {south: number; west: number; north: number; east: number};
}


@Injectable({
  providedIn: 'root'
})
export class DistgroupDataService extends IvServiceBase {

  distgroupSubject: AsyncSubject<DistributionGroup[]> = new AsyncSubject<DistributionGroup[]>();

  private retriveNeeded: boolean = true;

  constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService,
    private shipnodeDataService: ShipnodeDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  public getEntityUrl = () => { return EntityUrl.CONFIGURATION_DISTRIBUTIONGROUPS; }

  public getBearerToken = (credential: IVCredent) => {
    return credential == null ? null : credential.tokens.configurationDistributionGroups;
  }

  getDistgroupList(reloadDistgroups = false): Observable<DistributionGroup[]> {

    if (reloadDistgroups) {
      this.retriveNeeded = true;
      console.debug('User requested to reload distribution groups');
    }

    if (this.retriveNeeded) {
      this.retriveNeeded = false;
      console.debug('Requesting DGs from server.');
      this.retrieveAllDistgroups(this.distgroupSubject);
    }

    return this.distgroupSubject;
  }

  retrieveAllDistgroups(distgroupSubject: AsyncSubject<DistributionGroup[]>): void {
    this.getList<DistributionGroup>().subscribe(data => {
      this.populateAndPublishDistgroupDetail(distgroupSubject, data);
      // this.distgroupSubject.next(data);
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

    const setDGId = (dgId) => map(value => {
      const dg: DistributionGroup = <DistributionGroup>value;
      dg.distributionGroupId = dgId;
      return dg;
    });

    // const setDgIdAgain = (v: DistributionGroup, id: string): DistributionGroup => {
    //   v.distributionGroupId = id;
    //   return v;
    // }

    // Then get each distribution group's ship node list
    distgroups.forEach((dg, index) => {
      const dgGetShipnodeListObservable =
        this.getObject('/' + encodeURIComponent(dg.distributionGroupId))
          .pipe(setDGId(dg.distributionGroupId));

      dgSubscribers.push(dgGetShipnodeListObservable);
      // // For each DG subscribe to get DG's shipnode list
      // dgGetShipnodeListObservable.subscribe(data => {

      //   dg.shipNodes = [] as DGShipNode[];

      //   let response: DistributionGroup = data as DistributionGroup;

      //   Object.assign(dg.shipNodes, response.shipNodes);
      // });
    });

    console.debug('Distributiongroup getter Observable array ready.', dgSubscribers);


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

        console.debug('Received [%d/%d]:', index, emittingListLength, emitObj);

        if ((<DistributionGroup>emitObj).distributionGroupId) {
          // This is a distribution gorup
          const emitDG: DistributionGroup = <DistributionGroup>emitObj;

          const dgToEdit: DistributionGroup = distgroups.filter(dg => dg.distributionGroupId == emitDG.distributionGroupId)[0];
          // Copy the shipnodes into the dg in the data array
          dgToEdit.shipNodes = [] as ShipNode[];
          Object.assign(dgToEdit.shipNodes, emitDG.shipNodes)

          dgToEdit.shipNodes.forEach((dgshipnode) => {
            const shipnodeFromList: ShipNode = shipnodeList.filter(shipnode => shipnode.shipNode == dgshipnode.shipNode)[0];
            dgshipnode.latitude = shipnodeFromList.latitude;
            dgshipnode.longitude = shipnodeFromList.longitude;
          });
        } else {
          // This is emitted by the get ShipNode List and should come first.
          shipnodeList = <ShipNode[]>emitObj;
        }
      });

      console.debug('DG** Merged shipnode data into DGs.', distgroups);

      subjectToPublish.next(distgroups);

      subjectToPublish.complete();

    })

  }

  // for (let dg of distgroups){

  //   this.getObject('/' + encodeURIComponent(dg.distributionGroupId)).subscribe(data => {
  //     dg.shipNodes = [] as DGShipNode[];

  //     let response: DistributionGroup = data as DistributionGroup;

  //     Object.assign(dg.shipNodes, response.shipNodes);

  //     dg.center = {latitude: 0.0, longitude: 0.0};
  //     dg.corners = {south: 200.0, west: 200.0, north: -200.0, east: -200.0};

  //     let count: number = 0;

  //     for (let dgShipnode of dg.shipNodes) {
  //       let detailShipnode: ShipNode = this.shipnodeDataService.getShipnodeByName(dgShipnode.shipNode);
  //       if (detailShipnode != null) {
  //         dgShipnode.latitude = detailShipnode.latitude;
  //         dgShipnode.longitude = detailShipnode.longitude;

  //         count++;

  //         dg.center.latitude = (dg.center.latitude * (count - 1) + detailShipnode.latitude) / count;
  //         dg.center.longitude = (dg.center.longitude * (count - 1) + detailShipnode.longitude) / count;

  //         if (detailShipnode.latitude < dg.corners.south) {
  //           dg.corners.south = detailShipnode.latitude
  //         }

  //         if (detailShipnode.latitude > dg.corners.north) {
  //           dg.corners.north = detailShipnode.latitude;
  //         }

  //         if (detailShipnode.longitude < dg.corners.west) {
  //           dg.corners.west = detailShipnode.longitude
  //         }

  //         if (detailShipnode.longitude > dg.corners.east) {
  //           dg.corners.east = detailShipnode.longitude;
  //         }

  //       } else {
  //         console.warn ('Not able to find shipnode [%s] from list', dgShipnode.shipNode, dgShipnode);
  //       }
  //     }
  //   });
  // }
  // }
}
