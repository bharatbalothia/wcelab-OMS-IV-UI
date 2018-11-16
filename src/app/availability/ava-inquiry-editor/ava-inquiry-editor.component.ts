import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { IvConstant } from 'src/app/iv-constant';
import { DistgroupDataService, DistributionGroup } from 'src/app/distgroup/distgroup-data.service';
import { AvaiabilityInquiry, AvaiabilityInquiryLine } from '../availability-data.service';

// import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-ava-inquiry-editor',
  templateUrl: './ava-inquiry-editor.component.html',
  styleUrls: ['./ava-inquiry-editor.component.less']
})
export class AvaInquiryEditorComponent implements OnInit, OnChanges {

  filteredUomOptions: Observable<string[]>;

  filteredProdClassOptions: Observable<string[]>;

  filteredDeliveryMethodOptions: Observable<string[]>;

  searchByDgOrShipnode: string;

  public readonly UOM_OPTIONS = IvConstant.UOM_OPTIONS;
  public readonly PRODCLASS_OPTIONS = IvConstant.PROD_CLASS_OPTIONS;
  public readonly DELIVERY_METHOD_OPTIONS = IvConstant.DELIVERY_METHOD_OPTIONS;

  distgroupList: DistributionGroup[] = new Array<DistributionGroup>();

  inquiryLineDisplayColumns: string[] = [
    'itemId', 'unitOfMeasure', 'productClass', 'deliveryMethod', 'delete' ];

  // availabilityLineInquiryForm: FormGroup = new FormGroup({
  //   itemIdToInquire: new FormControl(''),
  //   unitOfMeasureToInquire: new FormControl(''),
  //   productClassToInquire: new FormControl(''),
  //   deliveryMethodToInquire: new FormControl(''),
  // });

  @Input("inquiry") avaInquiry : AvaiabilityInquiry;

  avaInquiryLineListSubject: BehaviorSubject<AvaiabilityInquiryLine[]>;

  constructor(distgroupData: DistgroupDataService) { 

    distgroupData.getDistgroupList().subscribe(
      data => {
        for (let dg of data) {
          this.distgroupList.push(dg);
        }
        console.debug(`After pushing data into distgroupData. ${JSON.stringify(this.distgroupList)}`);
      }
    );

    this.searchByDgOrShipnode = 'distgroup';
  
  }





  ngOnInit() {

    //TODO: Check if we need to instantiate 3 Options first.
    this.filteredUomOptions = new BehaviorSubject(IvConstant.UOM_OPTIONS);

    this.filteredProdClassOptions = new BehaviorSubject(IvConstant.PROD_CLASS_OPTIONS);

    this.filteredDeliveryMethodOptions = new BehaviorSubject(IvConstant.DELIVERY_METHOD_OPTIONS);

    this.avaInquiryLineListSubject = new BehaviorSubject(this.avaInquiry.lines);
  }

  doUomFilter(userInput): void {
    this.filteredUomOptions = this.createFilter(IvConstant.UOM_OPTIONS, userInput);
  }

  doProductClassFilter(userInput): void {
    this.filteredProdClassOptions = this.createFilter(IvConstant.PROD_CLASS_OPTIONS, userInput);
  }

  doDeliveryMethodFilter(userInput): void {
    this.filteredDeliveryMethodOptions = this.createFilter(IvConstant.DELIVERY_METHOD_OPTIONS, userInput);
  }

  // TODO: There has to be a better way than creating this BehaviorSubject each time
  private createFilter(options: string[], userInput: string): Observable<string[]> {
    console.debug('userINput: ', userInput);

    return new BehaviorSubject(options).pipe(
      startWith(''),
      map(value => this.filterStartWith(options, userInput))
    );
    
  }

  private filterStartWith(options: string[], userInput): string[] {
    const filterValue = userInput.toLowerCase();
    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    console.log('AvaInquiryEditorComponent.ngOnChanges fired!', changes);

  }

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

}
