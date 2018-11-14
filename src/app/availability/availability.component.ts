import { Component, OnInit, OnChanges } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';

import { StringOptionFilter } from '../string-option-filter';
import { AvaInquiryEditorComponent } from "./ava-inquiry-editor/ava-inquiry-editor.component"



@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less']
})
export class AvailabilityComponent implements OnInit {



  constructor() { }

  ngOnInit() {

  }

  // filterOption(options: string[], trigger: any, fieldToObserv: string) : Observable<string[]> {

  //   const {objectToObserv: Observable, proxy} = observe(trigger);

  //   return StringOptionFilter.filterOptions(
  //     options,
  //     trigger);
  // }

}
