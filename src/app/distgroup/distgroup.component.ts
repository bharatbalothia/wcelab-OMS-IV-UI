import { Component, OnInit } from '@angular/core';

import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs';


import {MatDialog, MatPaginator} from '@angular/material';

import {DistributionGroup, DistgroupDataService, DGShipNode} from './distgroup-data.service';

import {DistgroupEditorComponent} from './distgroup-editor/distgroup-editor.component';

// import {ArrayListPipe} from '../util/array-list.pipe.ts';


@Component({
  selector: 'app-distgroup',
  templateUrl: './distgroup.component.html',
  styleUrls: ['./distgroup.component.less']
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

  onAddnewDistgroup() : void {
    let newDG : DistributionGroup = {distributionGroupId: null, shipNodes: []};

    this.dataSource.getDistgroupSubject().value.push(newDG);

    this.openEditDistgroupDialog(newDG);

  }

  openEditDistgroupDialog(dgToEdit?: DistributionGroup) : void {

    let createNewDistgroup: boolean = false;

    let dgToEditCopy: DistributionGroup = null;

    if (dgToEdit == null) {
      dgToEditCopy = { distributionGroupId: null,
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

      let distgroupList = this.dataSource.getDistgroupSubject().value;

      
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
      this.dataSource.getDistgroupSubject().next(distgroupList);
    });
  }

  deleteDistgroup(distgroupToDelete: DistributionGroup): void {
    console.debug('Deleting Distribution Group. ', distgroupToDelete);

    this.dataService.deleteDistgroup(distgroupToDelete);
    
    let distgroupList = this.dataSource.getDistgroupSubject().value;

    let index = distgroupList.indexOf(distgroupToDelete, 0);
    if (index > -1) {
      distgroupList.splice(index, 1);
    }

    this.dataSource.getDistgroupSubject().next(distgroupList);

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

}

export class DistgroupDataSource extends DataSource<DistributionGroup> {
  

  constructor(private dataService: DistgroupDataService) {
    super();
    
  }

  getDistgroupSubject = (): BehaviorSubject<DistributionGroup[]> => {return this.dataService.distgroupSubject};


  connect(): Observable<DistributionGroup[]> {
    
    this.dataService.retrieveAllDistgroups();
    
    return this.dataService.getDistgroupList();
  }

  disconnect() {
  }
}