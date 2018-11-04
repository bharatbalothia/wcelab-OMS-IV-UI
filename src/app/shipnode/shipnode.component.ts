import {Component, OnInit} from '@angular/core';
// import {DataService} from '../data/data.service';
import {ShipNode} from '../datatype/ShipNode';
import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';


import {MatDialog} from '@angular/material';

import {ShipnodeDataService} from './shipnode-data.service';

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

  displayedColumns = ['shipNode', 'longitude', 'latitude', 'delete'];
  
  dataSource = new ShipnodeDataSource(this.dataService);

  openAddShipnodeDialog() : void {
    let dialogRef = this.dialog.open(ShipnodeEditorComponent, {
      width: '600px',
      data: 'Create ShipNode'
    });

    dialogRef.componentInstance.event.subscribe((result) => {
      this.dataService.addShipnode(result.data);
    });
  }

  // deleteShipnode(shipNode) {
    
  //   this.dataService.deleteShipnode(shipNode);


  //   this.dataService = new ShipnodeDataSource(this.dataService);

  // }
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