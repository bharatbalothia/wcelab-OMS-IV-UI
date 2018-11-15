import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import {Observable} from 'rxjs';

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
    'itemId', 'unitOfMeasure', 'productClass', 'deliveryMethod' ];

  availabilityLineInquiryForm: FormGroup = new FormGroup({
    unitOfMeasureToInquire: new FormControl(''),
    productClassToInquire: new FormControl(''),
    deliveryMethodToInquire: new FormControl(''),
  });

  constructor(distgroupData: DistgroupDataService) { 

    this.distgroupList = distgroupData.getDistgroupList().value;
  
  }

  ngOnInit() {

    
    this.filteredUomOptions = StringOptionFilter.filterOptions(
      IvConstant.UOM_OPTIONS,
      this.availabilityLineInquiryForm.controls.unitOfMeasureToInquire.valueChanges);

    this.filteredProdClassOptions = StringOptionFilter.filterOptions(
      IvConstant.PROD_CLASS_OPTIONS,
      this.availabilityLineInquiryForm.controls.productClassToInquire.valueChanges);

    this.filteredDeliveryMethodOptions = StringOptionFilter.filterOptions(
      IvConstant.DELIVERY_METHOD_OPTIONS,
      this.availabilityLineInquiryForm.controls.deliverMethodToInquire.valueChanges);
  
  }

  @Input("inquiry") avaInquiry : AvaiabilityInquiry;
  
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    console.log('AvaInquiryEditorComponent.ngOnChanges fired!', changes);

  }

}
