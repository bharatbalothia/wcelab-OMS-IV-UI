import { Component, OnInit } from '@angular/core';

import { SupplyDataService, SupplyQuery, ItemSupply } from './supply-data.service';

import {BehaviorSubject} from 'rxjs';

import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent {

  displayedColumns = ['itemId', 'shipNode', 'type', 'shipByDate', 'quantity','delete'];
  // displayedColumns = ['itemId', 'unitOfMeasure', 'productClass', 'shipNode', 'type', 'shipByDate', 'quantity','delete'];
  

  constructor(private dataService: SupplyDataService) {

    // this.querySupply();

  }

  supplyInquiryForm : FormGroup = new FormGroup({
    itemIdToInquire: new FormControl(''),
    unitOfMeasureToInquire: new FormControl(''),
    productClassToInquire: new FormControl(''),
    shipNodeToInquire: new FormControl(''),
  });

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
    let inq = this.supplyInquiryForm;
    return {
      itemId: inq.controls.itemIdToInquire.value,
      unitOfMeasure: inq.controls.unitOfMeasureToInquire.value,
      productClass: inq.controls.productClassToInquire.value,
      shipNode: inq.controls.shipNodeToInquire.value,
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

