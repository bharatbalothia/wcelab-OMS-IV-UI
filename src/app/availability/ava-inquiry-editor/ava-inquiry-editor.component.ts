import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { IvConstant } from 'src/app/iv-constant';
import { DistgroupDataService } from 'src/app/distgroup/distgroup-data.service';

import { FormGroup, FormControl } from '@angular/forms';
import { StringOptionFilter } from 'src/app/string-option-filter';



export interface AvaiabilityInquiryLine {
  lineId: number;
  itemId: string;
  unitOfMeasure?: string;
  productClass?: string;
  deliveryMethod?: string;
  shipNodes?: string[];
};

export interface AvaiabilityInquiry {
  distributionGroupId?: string;
  segment?: string;
  segmentType?: string;
  lines: AvaiabilityInquiryLine[],
}

@Component({
  selector: 'app-ava-inquiry-editor',
  templateUrl: './ava-inquiry-editor.component.html',
  styleUrls: ['./ava-inquiry-editor.component.less']
})
export class AvaInquiryEditorComponent implements OnInit, OnChanges {

  filteredUomOptions: Observable<string[]>;

  filteredProdClassOptions: Observable<string[]>;

  filteredDeliveryMethodOptions: Observable<string[]>;

  public readonly UOM_OPTIONS = IvConstant.UOM_OPTIONS;
  public readonly PRODCLASS_OPTIONS = IvConstant.PROD_CLASS_OPTIONS;
  public readonly DELIVERY_METHOD_OPTIONS = IvConstant.DELIVERY_METHOD_OPTIONS;

  distgroupList: Observable<string[]>;

  inquiryLineDisplayColumns: string[] = [
    'itemId', 'unitOfMeasure', 'productClass', 'deliveryMethod', 'delete' ];

  availabilityLineInquiryForm: FormGroup = new FormGroup({
    itemIdToInquire: new FormControl(''),
    unitOfMeasureToInquire: new FormControl(''),
    productClassToInquire: new FormControl(''),
    deliveryMethodToInquire: new FormControl(''),
  });

  @Input("inquiry") avaInquiry : AvaiabilityInquiry;

  avaInquiryLineListSubject: BehaviorSubject<AvaiabilityInquiry>;

  constructor(distgroupData: DistgroupDataService) { 

    this.distgroupList = distgroupData.getDistgroupList().value;
  
  }





  ngOnInit() {

    
    // this.filteredUomOptions = StringOptionFilter.filterOptions(
    //   IvConstant.UOM_OPTIONS,
    //   this.availabilityLineInquiryForm.controls.unitOfMeasureToInquire.valueChanges);

    // this.filteredProdClassOptions = StringOptionFilter.filterOptions(
    //   IvConstant.PROD_CLASS_OPTIONS,
    //   this.availabilityLineInquiryForm.controls.productClassToInquire.valueChanges);

    // this.filteredDeliveryMethodOptions = StringOptionFilter.filterOptions(
    //   IvConstant.DELIVERY_METHOD_OPTIONS,
    //   this.availabilityLineInquiryForm.controls.deliveryMethodToInquire.valueChanges);

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

  private createFilter(options: string[], userInput: string): Observable<string> {
    console.debug('userINput: ', userInput);

    return new BehaviorSubject<string[]>(options).pipe(
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

    this.avaInquiryLineListSubject.next(this.avaInquiry.lines);
  }

  deleteInquiryLine(inquiryLineToDelete: AvaiabilityInquiryLine): void {
    console.debug('Deleting Distribution Group. ', inquiryLineToDelete);
    
    let index = this.avaInquiry.lines.indexOf(inquiryLineToDelete, 0);
    
    if (index > -1) {
      this.avaInquiry.lines.splice(index, 1);
    }

    this.avaInquiryLineListSubject.next(this.avaInquiry.lines);
  }

}
