import { Component, OnInit } from '@angular/core';

import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';


import {MatDialog, MatPaginator} from '@angular/material';

import {DistributionGroup, DistgroupDataService, DGShipNode} from './distgroup-data.service';


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

  displayedColumns = ['distributionGroupId', 'delete'];
  
  dataSource = new DistgroupDataSource(this.dataService);

  stringifyShipnodes(dgShipNodes: DGShipNode[]): string{

   

    if (dgShipNodes == null) {
      return null;
    } else {

      let firstElement = true;
      
      let desc = '[';

      for (let shipnode of dgShipNodes) {
        if (!firstElement) {
          desc += ', ';
          firstElement = false;
        }
        desc += shipnode.shipNode;
      }
  
      desc += ']';
  
      return desc;

    }

  
  }

}

export class DistgroupDataSource extends DataSource<DistributionGroup> {
  

  constructor(private dataService: DistgroupDataService) {
    super();
    
  }

  getDistgroupDubject = () => {return this.dataService.distgroupSubject};


  connect(): Observable<DistributionGroup[]> {
    
    this.dataService.getAllDistgroups();
    
    return this.dataService.getDistgroupList();
  }

  disconnect() {
  }
}