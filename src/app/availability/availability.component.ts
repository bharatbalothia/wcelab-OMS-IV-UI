import { Component, OnInit } from '@angular/core';

import {Observable, BehaviorSubject} from 'rxjs';

import { NetworkAvailabilityDataService } from './network-availability-data.service';
import { NodeAvailabilityDataService } from './node-availability-data.service';
import { AvaiabilityInquiry, ShipnodeAvailability, NetworkAvailability } from './availability-data.service';



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

    if (inquiry.distributionGroupId != null && inquiry.distributionGroupId.length > 0 && inquiry.distributionGroupId != ' ') {
      
      console.debug("Getting Networking Availability");
      this.setInquiryShipnode(inquiry, null);
      
      let networkAva: Observable<NetworkAvailability> = this.networkAvaDataService.getNetworkAvailability(inquiry);

      networkAva.subscribe(data=>{console.debug(`Received network avaiability result: ${JSON.stringify(data)}`)});


    } else if (inquiry.shipnodeId != null && inquiry.shipnodeId.length > 0 && inquiry.shipnodeId != ' ') {
      
      console.debug("Getting Node Availability");
      this.setInquiryShipnode(inquiry, inquiry.shipnodeId);

      let nodeAva: Observable<ShipnodeAvailability> = this.nodeAvaDataService.getNodeAvailability(inquiry);

      nodeAva.subscribe(data=>{console.debug(`Received shipnode avaiability result: ${JSON.stringify(data)}`)});
    }
  }

  // Prepare inqury data before sending to the IV server
  private setInquiryShipnode(inquiry: AvaiabilityInquiry, shipnodeId: string) {

    if (shipnodeId != null && shipnodeId.length > 0){
      // Search node Availaiblity
      // set shipNodes array in each lines
      delete inquiry.distributionGroupId;
      delete inquiry.shipnodeId;
      for (let avaLine of inquiry.lines) {
        avaLine.shipNodes = [shipnodeId];
      }
    } else {
      // Search network Availability
      // remove any shipNodes array in each lines
      delete inquiry.shipnodeId;
      for (let avaLine of inquiry.lines) {
        delete avaLine.shipNodes;
      }
    }
  }
  
}
