import { Component, OnInit } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';

import { NetworkAvailabilityDataService } from './network-availability-data.service';
import { NodeAvailabilityDataService } from './node-availability-data.service';
import { AvaiabilityInquiry, AvailabilityResult } from './availability-data.service';



@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less']
})
export class AvailabilityComponent implements OnInit {

  inquiry: AvaiabilityInquiry;

  constructor(private networkAvaDataService: NetworkAvailabilityDataService,
    private nodeAvaDataService: NodeAvailabilityDataService) { 
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

    let avaResult: Observable<AvailabilityResult> = this.networkAvaDataService.getNetworkAvailability(this.inquiry);

    avaResult.subscribe(data=>{console.debug(`Received avaiability result: ${JSON.stringify(data)}`)});
  }
  
}
