/// <reference types="@types/googlemaps" />

// import { } from 'googlemaps';

import { Component, OnInit } from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatDialog, MatPaginator } from '@angular/material';

import { DistributionGroup, DistgroupDataService } from './distgroup-data.service';

import { DistgroupEditorComponent } from './distgroup-editor/distgroup-editor.component';
import { ArrayUtil } from '../util/array-util';
import { ShipnodeDataService, ShipNode } from '../shipnode/shipnode-data.service';

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

  displayedColumns = ['distributionGroupId', 'dgShipnodeList', 'delete'];

  dgTableDataSource: MatTableDataSource;

  private distgroupList: DistributionGroup[];

  private distgroupListSubject: BehaviorSubject<DistributionGroup[]>;

  constructor(public dialog: MatDialog, private dgDataService: DistgroupDataService,
    private shipnodeDataService: ShipnodeDataService) {
    // this.distgroupList = [] as DistributionGroup[];

    this.distgroupListSubject = new BehaviorSubject<DistributionGroup[]>(null);

    this.dgTableDataSource = new MatTableDataSource(this.distgroupListSubject);
  }


  ngOnInit() {

    this.dgDataService.getDistgroupList().subscribe(
      (dglist: DistributionGroup[]) => {
        this.distgroupList = dglist;
        this.publishDistgroupList();
      }
    );
  }

  editDistgroup(disgroupToEdit: DistributionGroup): void {

    console.debug(`Open distgroup editor for: ${disgroupToEdit.distributionGroupId}`);

    this.openEditDistgroupDialog(disgroupToEdit);
  }

  onAddnewDistgroup(): void {
    // let newDG: DistributionGroup = { distributionGroupId: null, shipNodes: [] };

    this.openEditDistgroupDialog(null);

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

    // TODO: need to unsubscribe from the dialog if user just cancel.
    dialogRef.componentInstance.event.subscribe((result) => {

      let distgroupEdited = result.data;

      this.dgDataService.putDistgroup(distgroupEdited);

      
      this.shipnodeDataService.getShipnodeList().subscribe(
        (shipnodeList: ShipNode[]) => {

          // Put shipnode GeoData in the shipnodes.
          DistgroupDataService.populateShipnodeGeoInDG(distgroupEdited, shipnodeList);

          if (createNewDistgroup) {
            // Add distgroupEdited to the array if it is new
            console.debug('Add new distribution group %s.', distgroupEdited.distributionGroupId);
            this.distgroupList.push(distgroupEdited);
          } else {
            console.debug('Update distribution group %s.', distgroupEdited.distributionGroupId);
            const dgToUpdate = 
              this.distgroupList.find(itm => itm.distributionGroupId == distgroupEdited.distributionGroupId);

            if (dgToUpdate != null) {
              dgToUpdate.distributionGroupId = distgroupEdited.distributionGroupId;
              dgToUpdate.shipNodes = distgroupEdited.shipNodes;
            }
          }
    
          this.publishDistgroupList();
        }
      );
    });
  }

  deleteDistgroup(distgroupToDelete: DistributionGroup): void {
    console.debug('Deleting Distribution Group. ', distgroupToDelete);

    this.dgDataService.deleteDistgroup(distgroupToDelete);

    ArrayUtil.findAndRemoveFromArray(this.distgroupList,
      (dg) => dg.distributionGroupId == distgroupToDelete.distributionGroupId);

    this.publishDistgroupList();
  }

  private publishDistgroupList() {
    this.distgroupListSubject.next(this.distgroupList);
  }


  //********************************************
  //** Code for the expanded element for map
  //********************************************

  expandedElement: DistributionGroup;

  onRowClick(distgroup: DistributionGroup) {
    this.expandedElement = (distgroup === this.expandedElement) ?
      null : distgroup;
  }

  /**
   * The function puts markers and bounds on the map.
   * @param map the google map widget
   * @param distgroup the distribution group to put on the map
   */
  onMapReady(map: google.maps.Map, distgroup: DistributionGroup) {

    console.debug(`Setting DG ${JSON.stringify(distgroup)} on map: `, map);

    const bounds = new google.maps.LatLngBounds();

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

  };

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

class MatTableDataSource extends DataSource<DistributionGroup> {

  constructor(private distgroupListObservable: Observable<DistributionGroup[]>) {
    super();
  }


  connect(): Observable<DistributionGroup[]> {
    return this.distgroupListObservable;
  }

  disconnect() {
  }
}