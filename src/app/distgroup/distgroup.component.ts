/// <reference types="@types/googlemaps" />

// import { } from 'googlemaps';

import { Component, OnInit } from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject, BehaviorSubject } from 'rxjs';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatDialog, MatPaginator } from '@angular/material';

import { DistributionGroup, DistgroupDataService, DGShipNode } from './distgroup-data.service';

import { DistgroupEditorComponent } from './distgroup-editor/distgroup-editor.component';

// import { LatLngBoundsLiteral } from '@agm/core';
// import {ArrayListPipe} from '../util/array-list.pipe.ts';



@Component({
  selector: 'app-distgroup',
  templateUrl: './distgroup.component.html',
  styleUrls: ['./distgroup.component.less'],
  animations: [
    trigger('distgroupExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'hidden' })),
      state('expanded', style({ height: "*", minHeight: '56px', width: '100%' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DistgroupComponent implements OnInit {

  constructor(public dialog: MatDialog, private dataService: DistgroupDataService) {
  }

  ngOnInit() {
  }

  displayedColumns = ['distributionGroupId', 'dgShipnodeList', 'delete'];

  dataSource = new DistgroupDataSource(this.dataService);

  editDistgroup(disgroupToEdit: DistributionGroup): void {

    console.debug(`Open distgroup editor for: ${disgroupToEdit.distributionGroupId}`);

    this.openEditDistgroupDialog(disgroupToEdit);
  }

  onAddnewDistgroup(): void {
    let newDG: DistributionGroup = { distributionGroupId: null, shipNodes: [] };

    this.dataSource.getDistrbutionGroupList().push(newDG);

    this.openEditDistgroupDialog(newDG);

  }

  openEditDistgroupDialog(dgToEdit?: DistributionGroup): void {

    let createNewDistgroup: boolean = false;

    let dgToEditCopy: DistributionGroup = null;

    if (dgToEdit == null) {
      dgToEditCopy = {
        distributionGroupId: null,
        shipNodes: []
      };
      createNewDistgroup = true;
    } else {
      dgToEditCopy = JSON.parse(JSON.stringify(dgToEdit));
      createNewDistgroup = false;
    }

    let dialogRef = this.dialog.open(DistgroupEditorComponent, {
      width: '600px',
      data: dgToEditCopy
    });

    dialogRef.componentInstance.event.subscribe((result) => {

      let distgroupEdited = result.data;

      this.dataService.putDistgroup(distgroupEdited);
      console.debug('Create or update distribution group.', distgroupEdited);

      var distgroupList: DistributionGroup[];

      this.dataSource.getDistgroupSubject().subscribe(dglst => distgroupList = dglst);
      // TODO: following block should be inside the subscribe
      if (createNewDistgroup) {
        // Add distgroupEdited to the array if it is new
        console.debug('Add new distribution group %s to client side', distgroupEdited.distributionGroupId);
        distgroupList.push(distgroupEdited);
      } else {
        console.debug('Update distribution group %s on client side', distgroupEdited.distributionGroupId);
        // update the existing DG
        dgToEdit.distributionGroupId = distgroupEdited.distributionGroupId;
        dgToEdit.shipNodes = distgroupEdited.shipNodes;
        // dgToEdit = JSON.parse(JSON.stringify(distgroupEdited));
      }
      this.dataSource.broadcastChange(distgroupList);
    });
  }

  deleteDistgroup(distgroupToDelete: DistributionGroup): void {
    console.debug('Deleting Distribution Group. ', distgroupToDelete);

    this.dataService.deleteDistgroup(distgroupToDelete);

    let distgroupList = this.dataSource.getDistrbutionGroupList();

    let index = distgroupList.indexOf(distgroupToDelete, 0);
    if (index > -1) {
      distgroupList.splice(index, 1);
    }

    this.dataSource.broadcastChange(distgroupList);

  }
  // // stringify list of shipnodes to a text to display 
  // stringifyShipnodes(dgShipNodes: DGShipNode[]): string{

  //   if (dgShipNodes == null) {
  //     return null;
  //   } else {

  //     let firstElement = true;

  //     let desc = '';

  //     for (let shipnode of dgShipNodes) {
  //       if (!firstElement) {
  //         desc += ', ';
  //         firstElement = false;
  //       }
  //       desc += shipnode.shipNode;
  //     }
  //     return desc;
  //   }

  // }

  expandedElement: DistributionGroup;

  onRowClick(distgroup: DistributionGroup) {
    this.expandedElement = (distgroup === this.expandedElement) ?
      null : distgroup;
  }

  onMapReady(map: google.maps.Map, distgroup: DistributionGroup) {
    console.debug(`Setting DG ${JSON.stringify(distgroup)} on map: `, map);

    this.dataService.getDistgroupList().subscribe(data => {

      console.debug('Map is ready to paint and received Distribution Group observable: ', data);

      // const bound: google.maps.LatLngBoundsLiteral = {
      //   east: -100,
      //   west: 100,
      //   north: -100,
      //   south: 100,
      // }

      const bounds  = new google.maps.LatLngBounds();

      for (let dgShipnode of distgroup.shipNodes) {

        const markerLoc = new google.maps.LatLng(dgShipnode.latitude, dgShipnode.longitude);

        const markerOption: google.maps.MarkerOptions = {
          position: markerLoc,
          map: map,
          label: dgShipnode.shipNode,
        };

        const marker: google.maps.Marker = new google.maps.Marker(markerOption);

        bounds.extend(markerLoc);

      }

      console.debug('Bounds for DG [%s]: SW: %s NE %s ', distgroup.distributionGroupId, 
      JSON.stringify(bounds.getSouthWest()), JSON.stringify(bounds.getNorthEast()));

      map.fitBounds(bounds, 0);
      map.panToBounds(bounds, 0);

    });

  }

  // getFitBounds(distgroup: DistributionGroup): LatLngBoundsLiteral {

  //   const distgroupGeoBounds: LatLngBoundsLiteral = {
  //     east: distgroup.corners.east, 
  //     west: distgroup.corners.west, 
  //     north: distgroup.corners.north, 
  //     south: distgroup.corners.south };

  //   console.debug(`Return Bounds of ${JSON.stringify(distgroupGeoBounds)} for: `, distgroup);

  //   return distgroupGeoBounds;
  // }

  // calculateAverageLat(distgroup: DistributionGroup){

  //   let average: number = 0.0;

  //   if (distgroup != null) {

  //     let sum: number = 0.0;

  //     for (let dgShipnode of distgroup.shipNodes){
  //       sum += dgShipnode.latitude;
  //     }

  //     average = sum / (distgroup.shipNodes.length * 1.0);
  //   }

  //   console.debug("Average lat is %d", average, distgroup);
  // }

  // calculateAverageLon(distgroup: DistributionGroup){

  //   let average: number = 0.0;

  //   if (distgroup != null) {

  //     let sum: number = 0.0;

  //     for (let dgShipnode of distgroup.shipNodes){
  //       sum += dgShipnode.longitude;
  //     }

  //     average = sum / (distgroup.shipNodes.length * 1.0);
  //   }

  //   console.debug("Average lon is %d", average, distgroup);

  // }
}

export class DistgroupDataSource extends DataSource<DistributionGroup> {

  private dgList: DistributionGroup[];

  // private distgroupListObv: Observable<DistributionGroup[]>;

  private localSubject: AsyncSubject<DistributionGroup[]> = new AsyncSubject<DistributionGroup[]>();

  constructor(private dataService: DistgroupDataService) {
    super();
  }

  getDistrbutionGroupList(): DistributionGroup[] {
    return this.dgList;
  }

  broadcastChange(dataToBroadcast: DistributionGroup[]): void {
    this.dgList = dataToBroadcast;
    this.localSubject.next(this.dgList);
    this.localSubject.complete();
  }

  getDistgroupSubject = (): Observable<DistributionGroup[]> => { return this.dataService.getDistgroupList() };

  // getDistgroupSubject = (): AsyncSubject<DistributionGroup[]> => {return this.dataService.distgroupSubject};


  connect(): Observable<DistributionGroup[]> {

    const distgroupListObv: Observable<DistributionGroup[]> = this.dataService.getDistgroupList();

    // Populate the class variable
    distgroupListObv.subscribe(emittedDgList => this.dgList = emittedDgList);

    // Return the Observable for others to observe
    return distgroupListObv;

  }

  disconnect() {
  }
}