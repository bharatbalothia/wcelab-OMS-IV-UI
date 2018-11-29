import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { AvailabilityInquiry, AvailabilityResult, AvailabilityResultLine, AvaiabilityInquiryLine } from './availability-data.service';
import { NetworkAvailabilityDataService } from './network-availability-data.service';
import { NodeAvailabilityDataService } from './node-availability-data.service';
import { SupplyDataService, SupplyQuery, ItemSupply, ShipNodeSupply } from "../supply/supply-data.service";
import { DistgroupDataService, DistributionGroup } from "../distgroup/distgroup-data.service";
import { stringify } from 'querystring';
import { debug } from 'util';


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
  private _requestSubject: Subject<AvailabilityInquiry>;

  public get responseSubject(): Observable<AvailabilityResult> {
    return this._responseSubject;
  }
  private _responseSubject: Subject<AvailabilityResult>;

  constructor(
    private distGroupDataService: DistgroupDataService,
    private supplyDataService: SupplyDataService,
    private networkAvaDataService: NetworkAvailabilityDataService,
    private nodeAvaDataService: NodeAvailabilityDataService) {

    this._requestSubject = new Subject<AvailabilityInquiry>();
    this._responseSubject = new Subject<AvailabilityResult>();

  }

  ngOnInit() {
  }

  public queryAvailability(inquiry: AvailabilityInquiry): void {

    console.debug('Query Availability for: ', inquiry);

    if (inquiry.distributionGroupId != null && inquiry.distributionGroupId.length > 0 && inquiry.distributionGroupId != ' ') {

      console.debug("Getting Networking Availability");

      this.prepareInquiryDocument(inquiry, null);

      this._requestSubject.next(inquiry);

      this.networkAvaDataService.getNetworkAvailability(inquiry)
        .subscribe((data: AvailabilityResult) => this.postprocessAvailability(inquiry, data));


    } else if (inquiry.shipnodeId != null && inquiry.shipnodeId.length > 0 && inquiry.shipnodeId != ' ') {

      console.debug("Getting Node Availability");
      this.prepareInquiryDocument(inquiry, inquiry.shipnodeId);

      this._requestSubject.next(inquiry);

      this.nodeAvaDataService.getNodeAvailability(inquiry)
        .subscribe((data: AvailabilityResult) => this.postprocessAvailability(inquiry, data));
    } else {
      console.warn("Not abelt determine if the inquiry is for distribution group or ship node. ", inquiry);
    }
  }

  /**
   * Prepare inqury data before sending to the IV server
   * @param inquiry the inquiry to be prepared. The function changes it inplace.
   * @param shipnodeId The shipnodeId, the function use this to determine if 
   * the inquiry is for a Distribution Group or a Ship Node.
   */
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

  private postprocessAvailability(inquiry: AvailabilityInquiry, availability: AvailabilityResult) {


    // this._responseSubject.next(availability);

    // Now merge the inquiry into result so it can be useful
    availability.inquiryHeader = inquiry;

    for (let resultLine of availability.lines) {
      const lineId = resultLine.lineId;
      // Find request line
      const inquiryLine = inquiry.lines.find(item => item.lineId == lineId);
      if (inquiryLine) {
        resultLine.inquiryLine = inquiryLine;
        // Let's get the supply detail for the availability.
        if (resultLine.networkAvailabilities) {
          this.postprocessNetworkAvailability(availability, inquiryLine, resultLine);
        } else {
          this.postprocessNodeAvailability(availability, inquiryLine, resultLine);
        }
      }
    }
    // Publish the merged result
    // this._responseSubject.next(availability);
  }


  private postprocessNetworkAvailability(availability: AvailabilityResult, inquiryLine: AvaiabilityInquiryLine, resultLine: AvailabilityResultLine) {

    for (let avaLine of resultLine.networkAvailabilities) {

      this.distGroupDataService.getDistgroupList().subscribe((dglist: DistributionGroup[]) => {
        // Find the DG that we are looking for

        const distgroup = dglist.find(dg => dg.distributionGroupId == avaLine.distributionGroupId);

        const supplyQueryObservables: Observable<ItemSupply[]>[] = [] as Observable<ItemSupply[]>[];

        for (let shipnodeInDg of distgroup.shipNodes) {
          let supplyInquiry: SupplyQuery = {
            itemId: inquiryLine.itemId,
            unitOfMeasure: inquiryLine.unitOfMeasure,
            productClass: inquiryLine.productClass,
            shipNode: shipnodeInDg.shipNode,
          };
          supplyQueryObservables.push(this.supplyDataService.getSupply(supplyInquiry));
        }

        const avaSupply = [];
        // For simplificaiton, we will just wait for all supply to come back
        combineLatest(supplyQueryObservables).subscribe((nodeSupplies: ItemSupply[][]) => {
          console.debug("Received all supplies for the availabilities: ", nodeSupplies);
          for (let nodeSupply of nodeSupplies) {
            if (nodeSupply && nodeSupply.length > 0) {
              const shipnodeSupply: ShipNodeSupply = {
                shipNode: nodeSupply[0].shipNode,
                supplies: nodeSupply
              };
              avaSupply.push(shipnodeSupply);
            }
          }
          avaLine.supplyDetail = avaSupply;

          console.debug("avaLine is now: ", avaLine);
          console.debug("Availabiliyt is now: ", availability);
          this._responseSubject.next(availability);
        });
      });

    }
  }

  private postprocessNodeAvailability(availability: AvailabilityResult, inquiryLine: AvaiabilityInquiryLine, resultLine: AvailabilityResultLine) {
  }
}
