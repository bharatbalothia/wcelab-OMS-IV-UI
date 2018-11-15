import { Component, OnInit } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';

import { StringOptionFilter } from '../string-option-filter';
import { AvaiabilityInquiry } from "./ava-inquiry-editor/ava-inquiry-editor.component"
import { IvConstant } from '../iv-constant';
import { DistgroupDataService } from '../distgroup/distgroup-data.service';



@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less']
})
export class AvailabilityComponent implements OnInit {

  inquiry: AvaiabilityInquiry;

  

  constructor( ) { 
    this.inquiry = {
      distributionGroupId: null,
      segment: null,
      segmentType: null,
      lines: [{
        lineId: 1,
        itemId: '',
        shipNodes: []
      },],
    }
  }

  ngOnInit() {

  }

  queryAvailability(): void {
    
    console.debug('Query Availability for: ', this.inquiry);

  }

  // filterOption(options: string[], trigger: any, fieldToObserv: string) : Observable<string[]> {

  //   const {objectToObserv: Observable, proxy} = observe(trigger);

  //   return StringOptionFilter.filterOptions(
  //     options,
  //     trigger);
  // }

}
