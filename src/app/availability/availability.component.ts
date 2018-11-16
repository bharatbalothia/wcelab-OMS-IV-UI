import { Component, OnInit } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';

import { NetworkAvailabilityDataService } from './network-availability-data.service';
import { NodeAvailabilityDataService } from './node-availability-data.service';
import { AvaiabilityInquiry } from './availability-data.service';



@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less']
})
export class AvailabilityComponent implements OnInit {

  // inquiry: AvaiabilityInquiry;

  constructor(private networkAvaDataService: NetworkAvailabilityDataService,
    private nodeAvaDataService: NodeAvailabilityDataService) {
  }

  ngOnInit() {
  }

  showAvailability(inquiry: AvaiabilityInquiry): void {
    
    console.debug('Query Availability for: ', inquiry);

    let avaResult = this.getAvailability(inquiry);

    avaResult.subscribe(data=>{console.debug(`Received avaiability result: ${JSON.stringify(data)}`)});
  }

  private setInquiryShipnode(inquiry: AvaiabilityInquiry, shipnodeId: string) {

    if (shipnodeId != null && shipnodeId.length > 0){
      // Search node Availaiblity
      delete inquiry.distributionGroupId;
      for (let avaLine of inquiry.lines) {
        avaLine.shipNodes = [shipnodeId];
      }
    } else {
      // Search network Availability
      delete inquiry.shipnodeId;
      for (let avaLine of inquiry.lines) {
        delete avaLine.shipNodes;
      }
    }
  }
  
  private getAvailability(inquiry: AvaiabilityInquiry) {
    
    if (inquiry.distributionGroupId != null && inquiry.distributionGroupId.length > 0 && inquiry.distributionGroupId != ' ') {
      
      console.debug("Getting Networking Availability");
      this.setInquiryShipnode(inquiry, null);
      return this.nodeAvaDataService.getNodeAvailability(inquiry);

    } else if (inquiry.shipnodeId != null && inquiry.shipnodeId.length > 0 && inquiry.shipnodeId != ' ') {
      
      console.debug("Getting Node Availability");
      this.setInquiryShipnode(inquiry, inquiry.shipnodeId);
      return this.networkAvaDataService.getNetworkAvailability(inquiry);
    }

    

  }
}
