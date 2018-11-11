import {Component} from '@angular/core';

import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs/Observable';


import { MatDialog } from '@angular/material';

import {ShipNode, ShipnodeDataService} from './shipnode-data.service';

import {ShipnodeEditorComponent} from './shipnode-editor/shipnode-editor.component';

// import {RestapiService} from '../restapi.service';

@Component({
  selector: 'app-shipnode',
  templateUrl: './shipnode.component.html',
  styleUrls: ['./shipnode.component.less']
})

export class ShipnodeComponent{
  
  constructor(public dialog: MatDialog, private dataService: ShipnodeDataService) {
  }

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = ['shipNode', 'latitude', 'longitude', 'delete'];
  
  dataSource = new ShipnodeDataSource(this.dataService);

  openAddShipnodeDialog(shipnodeToEdit?: ShipNode) : void {

    let createNewShipNode = false;

    if (shipnodeToEdit == null) {
      shipnodeToEdit = { shipNode: null,
        latitude: null,
        longitude: null,};
      createNewShipNode = true;
    }

    let dialogRef = this.dialog.open(ShipnodeEditorComponent, {
      width: '600px',
      data: shipnodeToEdit
    });

    dialogRef.componentInstance.event.subscribe((result) => {
      let shipNodeEdited = result.data;

      this.dataService.putShipnode(shipNodeEdited);

      if (createNewShipNode) {

        let shipnodeList = this.dataSource.getShipnodeSubject().value;

        shipnodeList.push(result.data);

        this.dataSource.getShipnodeSubject().next(shipnodeList);
        
        // console.log(`shipnodeSubject is now: ${JSON.stringify(this.dataSource.getShipnodeSubject().value})}`);
      }
    });
  }

  deleteShipnode(shipNode: ShipNode) : void {
    
    this.dataService.deleteShipnode(shipNode);

    let shipnodeList = this.dataSource.getShipnodeSubject().value;

    let index = shipnodeList.indexOf(shipNode, 0);
    if (index > -1) {
      shipnodeList.splice(index, 1);
    }

    this.dataSource.getShipnodeSubject().next(shipnodeList);

    // this.dataSource = new ShipnodeDataSource(this.dataService);
    
    // this.changeDetectorRefs.detectChanges();

  }

  editShipnode(shipnodeToEdit: ShipNode): void {
    
    console.debug('Editing Shipnode.', shipnodeToEdit);

    this.openAddShipnodeDialog(shipnodeToEdit);
  }
}

export class ShipnodeDataSource extends DataSource<ShipNode> {
  

  constructor(private dataService: ShipnodeDataService) {
    super();
    
  }

  getShipnodeSubject = (): BehaviorSubject<ShipNode[]> => {return this.dataService.getShipnodeList()};


  connect(): Observable<ShipNode[]> {
    
    // this.dataService.retrieveAllShipnodes();
    
    return this.dataService.getShipnodeList();
  }

  disconnect() {
  }
}