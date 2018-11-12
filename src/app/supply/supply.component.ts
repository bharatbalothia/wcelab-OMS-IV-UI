import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

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

  private readonly UOM_OPTIONS: string[] = ["EACH", "CASE", "PALLET"];
  private readonly PROD_CLASS_OPTIONS: string[] = ["NEW", "OPEN_BOX", "USED"];
  private readonly SUPPLY_TYPE: string[] = ['ONHAND', 'PO', 'PO_PLACED','PO_BACKORDER', 'PO_SCHEDULED', 'PO_RELEASED','INTRANSIT', 'HELD', 
  'PLANNED_PO', 'PLANNED_TRANSFER', 'WIP', 'WO_PLACED'];

  displayedColumns = ['itemId', 'shipNode', 'type', 'shipByDate', 'quantity','save', 'delete'];
  // displayedColumns = ['itemId', 'unitOfMeasure', 'productClass', 'shipNode', 'type', 'shipByDate', 'quantity','delete'];

  filteredUomOptions: Observable<string[]>;

  filteredProdClassOptions: Observable<string[]>;

  filteredSupplyTypeOptions: Observable<string[]>;

  constructor(
    private credentDataService: CredentialDataService,
    private shipnodeDataService: ShipnodeDataService,
    private dataService: SupplyDataService,
    private datePipe: DatePipe) {

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
      shipByDate: null,
    });

    this.supplyListSubjectCache.next(listOfItemSupply);
  }

  // Get the list of shipnode. To populate the dropdown box
  getShipnodeList() : ShipNode[] {

    let shipnodeList : ShipNode[] = this.shipnodeDataService.getShipnodeList().value;

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

  saveSupply(supplyElement: ItemSupply):void {

    const nowTimeString: string = this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ssZZZ');

    let supplyToSync = {
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

    this.dataService.putObject(supplyToSync);
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

