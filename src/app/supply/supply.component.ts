import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

import { SupplyDataService, SupplyQuery, ItemSupply, SupplyAdjustment } from './supply-data.service';

import {Observable, BehaviorSubject} from 'rxjs';

import { FormGroup, FormControl } from '@angular/forms';

import { ShipNode, ShipnodeDataService } from '../shipnode/shipnode-data.service';
import { CredentialDataService } from '../credential/credential-data.service';

import { IvConstant } from "../iv-constant";

import { StringOptionFilter } from "../string-option-filter";
@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent implements OnInit{
  
  
  displayedColumns = ['itemId', 'shipNode', 'type', 'shipByDate', 'quantity','save', 'delete'];

  filteredUomOptions: Observable<string[]>;

  filteredProdClassOptions: Observable<string[]>;

  // filteredSupplyTypeOptions: Observable<string[]>;

  public readonly SUPPLY_TYPE: string[] = IvConstant.SUPPLY_TYPE;

  constructor(
    private credentDataService: CredentialDataService,
    private shipnodeDataService: ShipnodeDataService,
    private dataService: SupplyDataService,
    private datePipe: DatePipe) {

    // this.querySupply();

  }

  ngOnInit() {

    // this.filteredUomOptions = StringOptionFilter. (IvConstant.UOM_OPTIONS, 
    //   this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges);

    // this.filteredUomOptions = this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(IvConstant.UOM_OPTIONS, value))
    // );

    this.filteredUomOptions = StringOptionFilter.filterOptions(
      IvConstant.UOM_OPTIONS,
      this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges);

    this.filteredProdClassOptions = StringOptionFilter.filterOptions(
      IvConstant.PROD_CLASS_OPTIONS,
      this.supplyInquiryForm.controls.productClassToInquire.valueChanges);

  }

  // private _filter(optionList: string[], value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return optionList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }

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
    
    const listOfItemSupply: ItemSupply[] =
      this.supplyListSubjectCache.value as ItemSupply[];

    listOfItemSupply.push({
      itemId: inq.controls.itemIdToInquire.value,
      unitOfMeasure: inq.controls.unitOfMeasureToInquire.value,
      productClass: inq.controls.productClassToInquire.value,
      organizationCode: this.credentDataService.getCredential().tenantID,
      shipNode: inq.controls.shipNodeToInquire.value,
      type: null,
      quantity: null,
      shipByDate: '2500-01-01T00:00:00Z',
      isNew: true,
    });

    this.supplyListSubjectCache.next(listOfItemSupply);
  }

  // Get the list of shipnode. To populate the dropdown box
  getShipnodeList() : Observable<ShipNode[]> {

    return this.shipnodeDataService.getShipnodeList();
    
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

  saveSupply(supplyElement: ItemSupply):void {

    // const nowTimeString: string = this.datePipe.transform(new Date(),'yyyy-MM-dd') + 'T'
    // this.datePipe.transform(new Date(),'HH:mm:ssZZZ');

    const nowTimeString: string = this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ssZZZ');

    let supplyToSync: SupplyAdjustment = {
      "eta": "1900-01-01T00:00:00Z",
      "itemId": supplyElement.itemId,
      "lineReference": " ",
      "productClass": supplyElement.productClass,
      "quantity": supplyElement.quantity,
      "reference": " ",
      "referenceType": " ",
      "segment": " ",
      "segmentType": " ",
      "shipByDate": supplyElement.shipByDate,
      "shipNode": supplyElement.shipNode,
      "sourceTs": nowTimeString,
      "tagNumber": " ",
      "type": supplyElement.type,
      "unitOfMeasure": supplyElement.unitOfMeasure,
    };

    this.dataService.syncSupply([supplyToSync]);
  }

  deleteSupply(supplyElement: ItemSupply):void {
    // Set the quantity to 0 and save it.
    supplyElement.quantity = 0;
    this.saveSupply(supplyElement);
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

