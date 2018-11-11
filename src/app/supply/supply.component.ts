import { Component, OnInit } from '@angular/core';

import { SupplyDataService, SupplyQuery } from './supply-data.service';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent {

  constructor(private dataService: SupplyDataService) {

    dataService.getSupply()
  }

  getSupply() {
    let query: SupplyQuery = {

    };

    this.dataService.getSupply(query);
  }


}



