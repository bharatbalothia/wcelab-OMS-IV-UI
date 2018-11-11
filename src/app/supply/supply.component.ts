import { Component, OnInit } from '@angular/core';

import { SupplyDataService, SupplyQuery } from './supply-data.service';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent {

  constructor(private dataService: SupplyDataService) {

    this.getSupply()
  }

  getSupply() {
    let query: SupplyQuery = {
      itemId: 'myitem',
      unitOfMeasure: 'EACH',
      productClass: 'NEW',
      shipNode: 'nztest_dallas_dc',
    };

    this.dataService.getSupply(query);
  }


}



