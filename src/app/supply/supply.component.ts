import { Component, OnInit } from '@angular/core';

import { SupplyDataService, SupplyQuery, ItemSupply } from './supply-data.service';

import {Observable, BehaviorSubject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ShipNode, ShipnodeDataService } from '../shipnode/shipnode-data.service';
import { CredentialDataService } from '../credential/credential-data.service';


@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent implements OnInit{

  displayedColumns = ['itemId', 'shipNode', 'type', 'shipByDate', 'quantity','delete'];
  // displayedColumns = ['itemId', 'unitOfMeasure', 'productClass', 'shipNode', 'type', 'shipByDate', 'quantity','delete'];
  

  private readonly UOM_OPTIONS: string[] = ["EACH", "CASE", "PALLET"];
  filteredUomOptions: Observable<string[]>;

  private readonly PROD_CLASS_OPTIONS: string[] = ["NEW", "OPENBOX", "DAMAGED"];
  filteredProdClassOptions: Observable<string[]>;

  constructor(
    private credentDataService: CredentialDataService,
    private shipnodeDataService: ShipnodeDataService,
    private dataService: SupplyDataService) {

    // this.querySupply();

  }

  ngOnInit() {

    this.filteredUomOptions = this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(this.UOM_OPTIONS, value))
    );

    this.filteredProdClassOptions = this.supplyInquiryForm.controls.productClassToInquire.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(this.PROD_CLASS_OPTIONS, value))
    );
  }

  private _filter(optionList: string[], value: string): string[] {
    const filterValue = value.toLowerCase();

    return optionList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

  addSupplyRow(): void {
    let inq = this.supplyInquiryForm;
    this.supplyListSubjectCache.value.put({
      itemId: inq.controls.itemIdToInquire.value,
      unitOfMeasure: inq.controls.unitOfMeasureToInquire.value,
      productClass: inq.controls.productClassToInquire.value,
      organizationCode: this.credentDataService.getCredential().tenantID,
      shipNode: inq.controls.shipNodeToInquire.value,
      type: null,
      quantity: null,
      shipByDate: null,
    });
  }

  getShipnodeList() : ShipNode[] {



    let shipnodeList : ShipNode[] = this.shipnodeDataService.getShipnodeList().value;

    // console.log(`getShipnodeList: ${JSON.stringify(shipnodeList)}`);
    return shipnodeList;

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

