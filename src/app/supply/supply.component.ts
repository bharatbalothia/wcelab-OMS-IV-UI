import { Component, OnInit } from '@angular/core';

import { SupplyDataService, SupplyQuery, ItemSupply } from './supply-data.service';

import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent {

  displayedColumns = ['organizationCode', 'itemId', 'unitOfMeasure', 'productClass', 'shipNode', 'type', 'shipByDate', 'quantity','delete'];
  

  constructor(private dataService: SupplyDataService) {

    this.getItemSupplySubject();

  }

  private supplyListSubjectCache: BehaviorSubject<ItemSupply[]>;

  getItemSupplySubject(): BehaviorSubject<ItemSupply[]> {

    return this.supplyListSubjectCache;
    
  };

  querySupply(): void {
    let supply: BehaviorSubject<ItemSupply[]>
     = this.dataService.getSupply(this.createQuery());
    this.supplyListSubjectCache = supply;
  
  }


  private createQuery = (): SupplyQuery => {
    return {
      itemId: 'NZT001',
      unitOfMeasure: 'EACH',
      productClass: 'NEW',
      shipNode: 'nztest_littleton_dc',
    };
  }

  // getSupply() {
  //   let query: SupplyQuery = {
  //     itemId: 'NZT001',
  //     unitOfMeasure: 'EACH',
  //     productClass: 'NEW',
  //     shipNode: 'nztest_littleton_dc',
  // };

  //   this.dataService.getSupply(query);
  // }


}



j