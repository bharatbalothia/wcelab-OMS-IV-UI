import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DistgroupDataService, DistributionGroup } from 'src/app/distgroup/distgroup-data.service';
import { IvConstant } from 'src/app/iv-constant';
import { ShipNode, ShipnodeDataService } from 'src/app/shipnode/shipnode-data.service';
import { AvailabilityInquiry, AvaiabilityInquiryLine } from '../availability-data.service';



// import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-ava-inquiry-editor',
  templateUrl: './ava-inquiry-editor.component.html',
  styleUrls: ['./ava-inquiry-editor.component.less']
})
export class AvaInquiryEditorComponent implements OnInit {

  // filteredUomOptions: Observable<string[]>;

  // filteredProdClassOptions: Observable<string[]>;

  // filteredDeliveryMethodOptions: Observable<string[]>;

  searchByDgOrShipnode: string;

  // public readonly UOM_OPTIONS = IvConstant.UOM_OPTIONS;
  // public readonly PRODCLASS_OPTIONS = IvConstant.PROD_CLASS_OPTIONS;
  // public readonly DELIVERY_METHOD_OPTIONS = IvConstant.DELIVERY_METHOD_OPTIONS;

  // distgroupList: DistributionGroup[] = new Array<DistributionGroup>();

  // shipnodeList: ShipNode[] = new Array<ShipNode>();

  inquiryLineDisplayColumns: string[] = [
    'itemId', 'unitOfMeasure', 'productClass', 'deliveryMethod', 'delete'];
  
  private avaInquiry: AvailabilityInquiry;

  // getProductClassOptions(): Observable<string[]> {

  //   const prdclassOptions = IvConstant.PROD_CLASS_OPTIONS;
  //   // prdclassOptions.push("ANOTHER ONE");
  //   return of(prdclassOptions);
  // }

  public readonly productClassOptionObservable: Observable<string[]> = of(IvConstant.PROD_CLASS_OPTIONS);

  public readonly uomOptionObservable: Observable<string[]> = of(IvConstant.UOM_OPTIONS);

  public readonly deliveryMethodOptionObservable: Observable<string[]> = of(IvConstant.DELIVERY_METHOD_OPTIONS);

  // availabilityLineInquiryForm: FormGroup = new FormGroup({
  //   itemIdToInquire: new FormControl(''),
  //   unitOfMeasureToInquire: new FormControl(''),
  //   productClassToInquire: new FormControl(''),
  //   deliveryMethodToInquire: new FormControl(''),
  // });

  // @Input("inquiry") avaInquiry: AvaiabilityInquiry;
  
  // Output event to query avaiability 
  @Output() queryAvailability = new EventEmitter<AvailabilityInquiry>();

  avaInquiryLineListSubject: BehaviorSubject<AvaiabilityInquiryLine[]>;

  constructor(private distgroupData: DistgroupDataService, private shipnodeData: ShipnodeDataService) {

    // distgroupData.getDistgroupList().subscribe(
    //   data => {
    //     // Clear the current distgroupList if needed
    //     if (this.distgroupList.length > 0) {
    //       console.info('Have to clear current %d member distgroup list', this.distgroupList.length, this.distgroupList);
    //       this.distgroupList.slice(0, this.distgroupList.length);
    //     }
    //     for (let dg of data) {
    //       this.distgroupList.push(dg);
    //     }
    //     console.debug(`After pushing data into distgroupData. ${JSON.stringify(this.distgroupList)}`);
    //   }
    // );

    // shipnodeData.getShipnodeList().subscribe(
    //   data => {
    //     // Clear the current shipnodelist if needed
    //     if (this.shipnodeList.length > 0) {
    //       console.info('Have to clear current %d member shipnode list', this.shipnodeList.length, this.shipnodeList);
    //       this.shipnodeList.slice(0, this.shipnodeList.length);
    //     }
    //     for (let shipnode of data) {
    //       this.shipnodeList.push(shipnode);
    //     }
    //     console.debug(`After pushing data into shipnodelist. ${JSON.stringify(this.shipnodeList)}`);
    //   }
    // );

    // Default to search by network
    this.searchByDgOrShipnode = 'distgroup';

  }

  getDistgroupList(): Observable<DistributionGroup[]> {
    return this.distgroupData.getDistgroupList();
  }

  getShipnodeList(): Observable<ShipNode[]>{
    return this.shipnodeData.getShipnodeList();
  }


  ngOnInit() {

    this.avaInquiry = {
      distributionGroupId: null,
      segment: null,
      segmentType: null,
      lines: [{
        lineId: 1,
        itemId: '',
        shipNodes: []
      },],
    };
    
    // //TODO: Check if we need to instantiate 3 Options first.
    // this.filteredUomOptions = new BehaviorSubject(IvConstant.UOM_OPTIONS);

    // this.filteredProdClassOptions = new BehaviorSubject(IvConstant.PROD_CLASS_OPTIONS);

    // this.filteredDeliveryMethodOptions = new BehaviorSubject(IvConstant.DELIVERY_METHOD_OPTIONS);

    this.avaInquiryLineListSubject = new BehaviorSubject(this.avaInquiry.lines);
  }

  // doUomFilter(userInput): void {
  //   this.filteredUomOptions = this.createFilter(IvConstant.UOM_OPTIONS, userInput);
  // }

  // doProductClassFilter(userInput): void {
  //   this.filteredProdClassOptions = this.createFilter(IvConstant.PROD_CLASS_OPTIONS, userInput);
  // }

  // doDeliveryMethodFilter(userInput): void {
  //   this.filteredDeliveryMethodOptions = this.createFilter(IvConstant.DELIVERY_METHOD_OPTIONS, userInput);
  // }

  // onSearchModeChange(event): void {

  //   console.debug('Search Mode Change Event: ', event);

  //   if (event != 'shipnode') {
  //     this.avaInquiry.shipnodeId = null;
  //   } else if (event != 'distgroup') {
  //     this.avaInquiry.distributionGroupId = null;
  //   }

  //   console.debug(`avaInquiry changed to ${JSON.stringify(this.avaInquiry)}`);
  // }

  submitQuery(): void {

    console.debug(`avaInquiry now: ${JSON.stringify(this.avaInquiry)}`);

    let queryClone: AvailabilityInquiry = {lines: []};

    Object.assign(queryClone, this.avaInquiry);

    if (this.searchByDgOrShipnode == 'shipnode') {
      queryClone.distributionGroupId = null;
    }else if ( this.searchByDgOrShipnode == "distgroup") {
      queryClone.shipnodeId = null;
    };

    console.debug(`avaInquiry after preparation: ${JSON.stringify(queryClone)}`);
    
    this.queryAvailability.emit(queryClone);

  }

  // // TODO: There has to be a better way than creating this BehaviorSubject each time
  // private createFilter(options: string[], userInput: string): Observable<string[]> {
  //   // console.debug('userINput: ', userInput);

  //   return new BehaviorSubject(options).pipe(
  //     startWith(''),
  //     map(value => this.filterStartWith(options, userInput))
  //   );

  // }

  // private filterStartWith(options: string[], userInput): string[] {
  //   const filterValue = userInput.toLowerCase();
  //   return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   // changes.prop contains the old and the new value...

  //   // console.debug('AvaInquiryEditorComponent.ngOnChanges fired!', changes);

  // }

  addInquiryLine(): void {

    console.debug("Adding new line to the inquiry.", this.avaInquiry);

    this.avaInquiry.lines.push({
      lineId: this.avaInquiry.lines.length + 1,
      itemId: '',
      shipNodes: [],
    });

    console.debug("Added new line to the inquiry.", this.avaInquiry);

    // for (let line of this.avaInquiry.lines) {
    //   this.avaInquiryLineListSubject.next(line);
    // }

    this.avaInquiryLineListSubject.next(this.avaInquiry.lines);
  }

  deleteInquiryLine(inquiryLineToDelete: AvaiabilityInquiryLine): void {
    console.debug('Deleting availability inquiry line. ', inquiryLineToDelete);

    let index = this.avaInquiry.lines.indexOf(inquiryLineToDelete, 0);

    if (index > -1) {
      this.avaInquiry.lines.splice(index, 1);
    }

    // for (let line of this.avaInquiry.lines) {
    //   this.avaInquiryLineListSubject.next(line);
    // }

    this.avaInquiryLineListSubject.next(this.avaInquiry.lines);
  }

  debuglog(message?: any, ...optionalParams: any[]): void {
    console.debug(message, optionalParams);
  }
}
