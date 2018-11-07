import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';


import {MatDialog} from '@angular/material';

import {ShipNode, ShipnodeDataService} from './shipnode-data.service';

import {ShipnodeEditorComponent} from './shipnode-editor/shipnode-editor.component';

// import {RestapiService} from '../restapi.service';

@Component({
  selector: 'app-shipnode',
  templateUrl: './shipnode.component.html',
  styleUrls: ['./shipnode.component.less']
})

export class ShipnodeComponent{
  
  constructor(public dialog: MatDialog, private dataService: ShipnodeDataService, private changeDetectorRefs: ChangeDetectorRef) {
  }

  displayedColumns = ['shipNode', 'longitude', 'latitude', 'delete'];
  
  dataSource = new ShipnodeDataSource(this.dataService);

  openAddShipnodeDialog(shipnodeToEdit?: ShipNode) : void {
    let dialogRef = this.dialog.open(ShipnodeEditorComponent, {
      width: '600px',
      data: 'Create ShipNode'
    });

    dialogRef.componentInstance.event.subscribe((result) => {
      this.dataService.addShipnode(result.data);
      // this.dataService.getData();
      this.dataSource = new ShipnodeDataSource(this.dataService);
      this.changeDetectorRefs.detectChanges();
    });
  }

  deleteShipnode(shipNode: ShipNode) {
    
    this.dataService.deleteShipnode(shipNode);

    this.dataSource = new ShipnodeDataSource(this.dataService);
    this.changeDetectorRefs.detectChanges();

  }

  editShipnode(shipnode: ShipNode) {
    
    console.log(`about to edit: ${shipnode.shipNode}`);
  }
}

export class ShipnodeDataSource extends DataSource<any> {
  constructor(private dataService: ShipnodeDataService) {
    super();
  }

  connect(): Observable<ShipNode[]> {
    return this.dataService.getData();
  }

  disconnect() {
  }
}