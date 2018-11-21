import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AvailabilityInquiry, AvailabilityResult } from './availability-data.service';
import { NetworkAvailabilityDataService } from './network-availability-data.service';
import { NodeAvailabilityDataService } from './node-availability-data.service';


@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less']
})
export class AvailabilityComponent implements OnInit {

  // inquiry: AvaiabilityInquiry;

  public get requestSubject(): Observable<AvailabilityInquiry> {
    return this._requestSubject;
  }
  private _requestSubject: BehaviorSubject<AvailabilityInquiry>;

  public get responseSubject(): Observable<AvailabilityResult> {
    return this._responseSubject;
  }
  private _responseSubject: BehaviorSubject<AvailabilityResult> ;

  constructor(private networkAvaDataService: NetworkAvailabilityDataService,
    private nodeAvaDataService: NodeAvailabilityDataService) {

      this._requestSubject = new BehaviorSubject<AvailabilityInquiry>(null);
      this._responseSubject = new BehaviorSubject<AvailabilityResult>(null);
  
  }

  ngOnInit() {
  }

  showAvailability(inquiry: AvailabilityInquiry): void {

    console.debug('Query Availability for: ', inquiry);

    if (inquiry.distributionGroupId != null && inquiry.distributionGroupId.length > 0 && inquiry.distributionGroupId != ' ') {

      console.debug("Getting Networking Availability");
      
      this.prepareInquiryDocument(inquiry, null);

      this._requestSubject.next(inquiry);

      this.networkAvaDataService.getNetworkAvailability(inquiry)
      .subscribe((data: AvailabilityResult) => this.processAvailabilityResult(inquiry, data));


    } else if (inquiry.shipnodeId != null && inquiry.shipnodeId.length > 0 && inquiry.shipnodeId != ' ') {

      console.debug("Getting Node Availability");
      this.prepareInquiryDocument(inquiry, inquiry.shipnodeId);

      this._requestSubject.next(inquiry);

      this.nodeAvaDataService.getNodeAvailability(inquiry)
      .subscribe( (data: AvailabilityResult) => this.processAvailabilityResult(inquiry, data));
    }
  }

  private processAvailabilityResult(inquiry: AvailabilityInquiry, result: AvailabilityResult) {
    // console.debug('Received shipnode avaiability result: ', result);
    this._responseSubject.next(result);

    // Now merge the inquiry into result so it can be useful
    result.inquiryHeader = inquiry;

    for (let resultLine of result.lines) {
      const lineId = resultLine.lineId;
      // Find request line
      const inquiryLine = inquiry.lines.find( item => item.lineId == lineId);
      if (inquiryLine) {
        resultLine.inquiryLine = inquiryLine;
      }
    }

    // Publish the merged result
    this._responseSubject.next(result);
  }

  // Prepare inqury data before sending to the IV server
  private prepareInquiryDocument(inquiry: AvailabilityInquiry, shipnodeId: string) {

    if (shipnodeId != null && shipnodeId.length > 0) {
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
