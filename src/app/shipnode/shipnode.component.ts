import {Component, OnInit} from '@angular/core';
// import {DataService} from '../data/data.service';
import {ShipNode} from '../datatype/ShipNode';
import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';

import {ShipnodeDataService} from './shipnode-data.service';

// import {RestapiService} from '../restapi.service';

@Component({
  selector: 'app-shipnode',
  templateUrl: './shipnode.component.html',
  styleUrls: ['./shipnode.component.less']
})

export class ShipnodeComponent{

  // private  shipnodes:  Array<object> = [];

  // constructor(private  restapiService:  RestapiService) { }

  // ngOnInit() {
  //     this.getShipnodes();
  // }

  // public  getShipnodes(){
  //     this.restapiService.getShipnodes().subscribe((data:  Array<object>) => {
  //         this.shipnodes  =  data;
  //         console.log(data);
  //     });
  // }
  
  constructor(private dataService: ShipnodeDataService) {
  }

  displayedColumns = ['shipNode', 'longitude', 'latitude', 'delete'];
  
  dataSource = new ShipnodeDataSource(this.dataService);

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