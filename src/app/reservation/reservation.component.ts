import { Component, OnInit } from '@angular/core';
import { ReservationQuery, ReservationResponseLine, ReservationRequest } from "./reservation-data.service";
import { of, Observable, BehaviorSubject } from 'rxjs';
import { IvConstant } from '../iv-constant';
import { ShipNode, ShipnodeDataService } from '../shipnode/shipnode-data.service';
import { DistgroupDataService, DistributionGroup } from '../distgroup/distgroup-data.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less']
})
export class ReservationComponent implements OnInit {

  private _reservationInquiry: ReservationQuery;

  public get reservationInquiry(): ReservationQuery {
    return this._reservationInquiry;
  }

  private _newReservation: ReservationRequest;

  public get newReservation(): ReservationRequest {
    return this._newReservation;
  }


  public get newReservationDisplayColumns(): string[] {
    return [
      'lineId', 'itemId', 'unitOfMeasure', 'productClass', 'quantity', 'deliveryMethod', 'shipNode', 'distributionGroup', 'delete'];
  }


  public get uomOptionObservable(): Observable<string[]> {
    return of(IvConstant.UOM_OPTIONS);
  }

  public get prodClassOptionObservable(): Observable<string[]> {
    return of(IvConstant.PROD_CLASS_OPTIONS);
  }

  public get deliveryMethodOptionObservable(): Observable<string[]> {
    return of(IvConstant.DELIVERY_METHOD_OPTIONS);
  }

  // Get the list of shipnode. To populate the dropdown box
  getShipnodeList(): Observable<ShipNode[]> {

    return this.shipnodeDataService.getShipnodeList();

  }

  getShipnodeIdList(): Observable<String[]> {

    return this.shipnodeDataService.getShipnodeList().pipe(
      map((value: ShipNode[]): string[] => {
        let newValue = [];
        for (let shp of value) {
          newValue.push(shp.shipNode);
        }
        return newValue;
      })
    );
  }

  getDistgroupList(): Observable<DistributionGroup[]> {
    return this.distgroupDataService.getDistgroupList();
  }

  getDistgroupIdList(): Observable<String[]> {

    return this.distgroupDataService.getDistgroupList().pipe(
      map((value: DistributionGroup[]): string[] => {
        let newValue = [];
        for (let dg of value) {
          newValue.push(dg.distributionGroupId);
        }
        return newValue;
      })
    );
  }

  constructor(private shipnodeDataService: ShipnodeDataService, 
    private distgroupDataService: DistgroupDataService) {

    this._reservationInquiry = {
      id: null,
      refernce: null,
    };

    this._newReservation = {

      reference: null,
      segment: null,
      segmentType: null,
      timeToExpire: 120,
      lines: [
        {
          deliveryMethod: null,
          distributionGroup: null,
          itemId: null,
          lineId: null,
          productClass: null,
          quantity: 0,
          shipNode: null,
          unitOfMeasure: null,
        }
      ]
    };

  }


  ngOnInit() {
  }

  private supplyListSubjectCache: BehaviorSubject<ReservationResponseLine[]> = new BehaviorSubject<ReservationResponseLine[]>(null);


  public getReservationSubject(): Observable<ReservationResponseLine[]> {
    return this.supplyListSubjectCache;
  }


  getTopPanelDescription(): string {
    if (this.reservationInquiry == null || (this.reservationInquiry.id == null && this.reservationInquiry.refernce == null)) {
      return null;
    } else {
      return `Reservatipn: [${this.reservationInquiry.id}] Refernce: [${this.reservationInquiry.refernce}]`;
    }
  }



}
