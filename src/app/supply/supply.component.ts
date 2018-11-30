import { DatePipe, CommonModule, formatDate } from "@angular/common";
import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { startWith, map } from "rxjs/operators";
import { CredentialDataService } from '../credential/credential-data.service';
import { IvConstant } from "../iv-constant";
import { ShipNode, ShipnodeDataService } from '../shipnode/shipnode-data.service';
import { StringOptionFilter } from "../string-option-filter";
import { ItemSupply, SupplyAdjustment, SupplyDataService, SupplyQuery } from './supply-data.service';





// interface SupplyInquiry {
//   itemIdToInquire: string;
//   unitOfMeasureToInquire: string;
//   productClassToInquire: string;
//   shipNodeToInquire: string;
// }



@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent implements OnInit {


  // displayedColumns = ['itemId', 'shipNode', 'type', 'shipByDate', 'quantity','save', 'delete'];
  displayedColumns = ['type', 'shipByDate', 'quantity', 'save', 'delete'];

  // filteredUomOptions: Observable<string[]>;

  // filteredProdClassOptions: Observable<string[]>;

  // filteredSupplyTypeOptions: Observable<string[]>;

  uomBase: Observable<string[]> = of(IvConstant.UOM_OPTIONS);
  uomFiletered: Observable<string[]> = this.uomBase;

  productClassBase: Observable<string[]> = of(IvConstant.PROD_CLASS_OPTIONS);
  productClassFiltered: Observable<string[]> = this.productClassBase;

  supplyTypeBase: Observable<string[]> = of(IvConstant.SUPPLY_TYPE);

  public readonly SUPPLY_TYPE: string[] = IvConstant.SUPPLY_TYPE;

  private _supplyInquiry: SupplyQuery;

  public get supplyInquiry(): SupplyQuery {
    return this._supplyInquiry;
  }

  @Input() get expandInquiryPanel(): boolean {
    return this._expandInquiryPanel;
  }
  private _expandInquiryPanel: boolean;


  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private credentDataService: CredentialDataService,
    private shipnodeDataService: ShipnodeDataService,
    private dataService: SupplyDataService,
    private datePipe: DatePipe) {

    // this.querySupply();
    this._supplyInquiry = {
      itemId: null,
      unitOfMeasure: null,
      productClass: null,
      shipNode: null,
    };

    this._expandInquiryPanel = true;
  }

  ngOnInit() {

    // this.filteredUomOptions = StringOptionFilter. (IvConstant.UOM_OPTIONS, 
    //   this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges);

    // this.filteredUomOptions = this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(IvConstant.UOM_OPTIONS, value))
    // );

    // this.filteredUomOptions = StringOptionFilter.filterOptions(
    //   IvConstant.UOM_OPTIONS,
    //   this.supplyInquiryForm.controls.unitOfMeasureToInquire.valueChanges);

    // this.filteredProdClassOptions = StringOptionFilter.filterOptions(
    //   IvConstant.PROD_CLASS_OPTIONS,
    //   this.supplyInquiryForm.controls.productClassToInquire.valueChanges);

  }

  // private _filter(optionList: string[], value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return optionList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }

  // supplyInquiryForm : FormGroup = new FormGroup({
  //   itemIdToInquire: new FormControl(''),
  //   unitOfMeasureToInquire: new FormControl(''),
  //   productClassToInquire: new FormControl(''),
  //   shipNodeToInquire: new FormControl(''),
  // });


  // doOptionFilter(optionBase: Observable<string[]>, optionFilteredName: string, userInput: string): void {

  //   console.debug("doOptionFilter got input: %s for filter %s with observable: ", userInput, optionFilteredName, optionBase);

  //   const filterValue = userInput ? userInput.toLocaleLowerCase() : null;

  //   this[optionFilteredName] = optionBase.pipe(
  //     startWith(''),
  //     map((optionsInPipe: string[]): string[] => {
  //       return this.filterOptionsInPipe(optionsInPipe, filterValue);
  //     })
  //   );
  // }

  // private filterOptionsInPipe(optionsInPipe, filterValue: string): string[] {
  //   // console.debug('About to filter %s from pipe of: ', filterValue, optionsInPipe);
  //   if (filterValue == null || filterValue.length == 0) {
  //     return optionsInPipe;
  //   } else {
  //     return optionsInPipe ? optionsInPipe.filter(option => option.toLowerCase().indexOf(filterValue) === 0) : null;
  //   }
  // }

  private supplyListSubjectCache: BehaviorSubject<ItemSupply[]> = new BehaviorSubject<ItemSupply[]>(null);

  getItemSupplySubject(): BehaviorSubject<ItemSupply[]> {

    return this.supplyListSubjectCache;

  };

  querySupply(): void {

    console.debug('Inquirying supply for: ', this.supplyInquiry);

    this.dataService.getSupply(this.supplyInquiry).subscribe(
      (data: ItemSupply[]) => {
        this.supplyListSubjectCache.next(data);
      }
    );

    this._expandInquiryPanel = false;

    this.changeDetectorRefs.markForCheck();
  }

  addSupplyRow(): void {
    // let inq = this.supplyInquiryForm;

    const listOfItemSupply: ItemSupply[] =
      this.supplyListSubjectCache.value as ItemSupply[];

    listOfItemSupply.push({
      eta: "1900-01-01T00:00:00Z",
      itemId: this._supplyInquiry.itemId,
      unitOfMeasure: this._supplyInquiry.unitOfMeasure,
      productClass: this._supplyInquiry.productClass,
      organizationCode: this.credentDataService.getCredential().tenantID,
      shipNode: this._supplyInquiry.shipNode,
      type: null,
      quantity: null,
      shipByDate: '2500-01-01T00:00:00Z',
      isNew: true,
    });

    this.supplyListSubjectCache.next(listOfItemSupply);
  }

  // Get the list of shipnode. To populate the dropdown box
  getShipnodeList(): Observable<ShipNode[]> {

    return this.shipnodeDataService.getShipnodeList();

  }


  getShipnodeIdList(): Observable<String[]> {

    return this.shipnodeDataService.getShipnodeList().pipe(
      map((value: ShipNode[]): string[] => {
        let newValue = [];
        for (let shp of value) {
          newValue.push(shp.shipNode);
        }
        return newValue;
      })
    );
  }

  // private createQuery = (): SupplyQuery => {
  //   let inq = this.supplyInquiryForm;
  //   return {
  //     itemId: inq.controls.itemIdToInquire.value,
  //     unitOfMeasure: inq.controls.unitOfMeasureToInquire.value,
  //     productClass: inq.controls.productClassToInquire.value,
  //     shipNode: inq.controls.shipNodeToInquire.value,
  //   };
  // }

  saveSupply(supplyElement: ItemSupply): void {

    // const nowTimeString: string = this.datePipe.transform(new Date(),'yyyy-MM-dd') + 'T'
    // this.datePipe.transform(new Date(),'HH:mm:ssZZZ');

    const nowTimeString: string = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ssZZZ');

    const supplyToSync: SupplyAdjustment = {
      eta: supplyElement.eta,
      itemId: supplyElement.itemId,
      lineReference: supplyElement.lineReference,
      productClass: supplyElement.productClass,
      quantity: supplyElement.quantity,
      reference: supplyElement.reference,
      referenceType: supplyElement.referenceType,
      segment: supplyElement.segment,
      segmentType: supplyElement.segmentType,
      shipByDate: supplyElement.shipByDate,
      shipNode: supplyElement.shipNode,
      sourceTs: nowTimeString,
      tagNumber: supplyElement.tagNumber,
      type: supplyElement.type,
      unitOfMeasure: supplyElement.unitOfMeasure,
    };

    // Clearn up the supply times
    if (supplyToSync.eta < '2018-01-01') {
      supplyToSync.eta = '1900-01-01T00:00:00Z';
    }

    if (supplyToSync.shipByDate > '2100-01-01') {
      supplyToSync.shipByDate = "2500-01-01T00:00:00Z";
    }
    
    this.dataService.syncSupply([supplyToSync]);
  }

  deleteSupply(supplyElement: ItemSupply): void {
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

  getTitleForSupplyLine(itemSupply: ItemSupply): string {

    return this.getTitle(itemSupply) || '';

  }

  private getTitle(itemSupply: ItemSupply): string {

    // console.debug('creating titel for: ', itemSupply);

    const etaDate = itemSupply.eta ? new Date(itemSupply.eta) : null;

    const now = new Date();

    const etaString = etaDate ? (etaDate < now) ? "Now" : "after " + formatDate(etaDate, "yyyy-MM-dd", "en-US", "UTC") : "";

    const shipbyDate = new Date(itemSupply.shipByDate);

    const shipbyString = formatDate(shipbyDate, "yyyy-MM-dd", "en-US", "UTC");

    return `${itemSupply.shipNode}: ${itemSupply.quantity} ${itemSupply.type} ${etaString}`;
  }

  getTopPanelDescription(): string {
    if (this.supplyInquiry == null || this.supplyInquiry.itemId == null || this.supplyInquiry.shipNode == null) {
      return null;
    } else {
      return `${this.supplyInquiry.productClass} ${this.supplyInquiry.itemId} ${this.supplyInquiry.unitOfMeasure} ${this.supplyInquiry.shipNode}`;
    }
  }

}

