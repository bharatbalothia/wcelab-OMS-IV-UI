import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import {Observable} from 'rxjs';

import { IvConstant } from 'src/app/iv-constant';

export interface AvaiabilityInquiryLine {
  deliveryMethod: string;
  itemId: string;
  lineId: number;
  productClass: string;
  unitOfMeasure: string;
};

export interface AvaiabilityInquiry {
  distributionGroupId: string;
  segment: string;
  segmentType: string;
  "lines": AvaiabilityInquiryLine[],
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

  avaInquiry: AvaiabilityInquiry;

  public readonly UOM_OPTIONS = IvConstant.UOM_OPTIONS;
  public readonly PRODCLASS_OPTIONS = IvConstant.PROD_CLASS_OPTIONS;
  public readonly DELIVERY_METHOD_OPTIONS = IvConstant.DELIVERY_METHOD_OPTIONS;

  constructor() { }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    console.log('AvaInquiryEditorComponent.ngOnChanges fired!', changes);
    
  }

}
