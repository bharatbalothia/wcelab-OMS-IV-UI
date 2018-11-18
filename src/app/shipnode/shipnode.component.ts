import {Component} from '@angular/core';

import {DataSource} from '@angular/cdk/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import {BehaviorSubject, of} from 'rxjs';
import {Observable} from 'rxjs/Observable';


import { MatDialog } from '@angular/material';

import {ShipNode, ShipnodeDataService} from './shipnode-data.service';

import {ShipnodeEditorComponent} from './shipnode-editor/shipnode-editor.component';

// import {RestapiService} from '../restapi.service';

@Component({
  selector: 'app-shipnode',
  templateUrl: './shipnode.component.html',
  styleUrls: ['./shipnode.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'hidden'})),
      state('expanded', style({height: "*", minHeight: '56px', width: '100%'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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


  expandedElement: ShipNode;

  onRowClick(shipNodeClicked: ShipNode) {
    
      this.expandedElement = (shipNodeClicked !== this.expandedElement) ? 
        shipNodeClicked : null;
  }

  // showMap(event: any, shipnode: ShipNode) {
  //   console.debug("showmap called. ", event, shipnode);

  //   let mapDiv = event.target.nextSibling;

  //   console.debug("map div is: ", mapDiv);

  //   var mapProp = {
  //     center: new google.maps.LatLng(shipnode.latitude, shipnode.longitude),
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
  //   let map = new google.maps.Map(mapDiv.nativeElement, mapProp);
  // }
}

export class ShipnodeDataSource extends DataSource<ShipNode> {
  

  constructor(private dataService: ShipnodeDataService) {
    super();
    
  }

  getShipnodeSubject = (): BehaviorSubject<ShipNode[]> => {return this.dataService.getShipnodeList()};


  connect(): Observable<any[]> {

    // let tableRowArray: any[] = new Array();

    // this.dataService.getShipnodeList(true).subscribe(data => {
    //   data.forEach(element => tableRowArray.push(element, {detailRow: true, element}));
    //   console.debug('loaded all rows. ', tableRowArray);
    // });

    // return of(tableRowArray);
    
    return this.dataService.getShipnodeList();
  }

  disconnect() {
  }
}