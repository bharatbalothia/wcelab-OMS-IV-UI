import { Component, OnInit } from '@angular/core';

import { SupplyDataService } from './supply-data.service';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent implements OnInit {

  constructor(private dataService: SupplyDataService) { }

  ngOnInit() {
  }

}



