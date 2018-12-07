import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ReservationQuery, ReservationResponseLine, ReservationRequest, ReservationRequestLine, ReserveMode, ReservationDataService, ReservationRequestResultLine, ReservationQueryMode } from "./reservation-data.service";
import { of, Observable, BehaviorSubject } from 'rxjs';
import { IvConstant } from '../iv-constant';
import { ShipNode, ShipnodeDataService } from '../shipnode/shipnode-data.service';
import { DistgroupDataService, DistributionGroup } from '../distgroup/distgroup-data.service';
import { map } from 'rxjs/operators';
import { ArrayUtil } from '../util/array-util';
import { ObjectUtil } from '../util/object-util';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less'],
  encapsulation: ViewEncapsulation.None,
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


  public get newReservationDisplayColumnsRow1(): string[] {
    return [
      'lineId', 'itemId', 'quantity', 'shipNodeOrDG'];
  }

  public get newReservationDisplayColumnsRow2(): string[] {
    return [
      'unitOfMeasure', 'productClass', 'deliveryMethod', 'button'];
  }


  public get newReservationDisplayColumnsFooter(): string[] {
    return ['button'];
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

  private _selectorSnOrDg: string[] = [] as string[];
  public get selectorSnOrDg(): string[] {
    return this._selectorSnOrDg;
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

  private _ReserveModeRef: typeof ReserveMode = ReserveMode;
  public get ReserveModeRef(): typeof ReserveMode {
    return this._ReserveModeRef;
  }


  constructor(
    private reservationDataService: ReservationDataService,
    private shipnodeDataService: ShipnodeDataService,
    private distgroupDataService: DistgroupDataService) {

    this._reservationInquiry = {
      queryMode: ReservationQueryMode.Reference,
      id: null,
      reference: null,
    };

    this._newReservation = {

      reference: null,
      segment: null,
      segmentType: null,
      timeToExpire: null,
      lines: [
        this.createNewReservationLine(0)
      ]
    };

  }


  ngOnInit() {
  }

  private supplyListSubjectCache: BehaviorSubject<ReservationResponseLine[]> = new BehaviorSubject<ReservationResponseLine[]>(null);


  public getReservationSubject(): Observable<ReservationResponseLine[]> {
    return this.supplyListSubjectCache;
  }


  // getTopPanelDescription(): string {
  //   if (this.reservationInquiry == null || (this.reservationInquiry.id == null && this.reservationInquiry.reference == null)) {
  //     return null;
  //   } else {
  //     return `Reservation: [${this.reservationInquiry.id}] Refernce: [${this.reservationInquiry.reference}]`;
  //   }
  // }

  addReservationLine(): void {
    const cloneOfNewReservation = JSON.parse(JSON.stringify(this.newReservation));

    cloneOfNewReservation.lines.push(
      this.createNewReservationLine(this.newReservation.lines.length)
    );

    this._newReservation = cloneOfNewReservation;

    console.debug('Updated the reservation to: ', this.newReservation);

    // this.changeDetectorRefs.detectChanges();
  }

  /**
   * Event handler for creating new reservation.
   */
  createReservation(): void {

    const cleanedReservation = this.cleanupShipnodeAndDistgroup(this.newReservation);

    ObjectUtil.removeNullOrEmptyStringProperties(cleanedReservation);

    console.debug("Creating new reservation with input: ", cleanedReservation);

    this.reservationDataService.createReservation(cleanedReservation).subscribe(
      (response: ReservationRequestResultLine[]) => {
        console.debug("Response of the reservation: ", response);
      }
    )
  }

  private cleanupShipnodeAndDistgroup(reservationToCleanup: ReservationRequest): ReservationRequest {
    const clonOfReserv: ReservationRequest = JSON.parse(JSON.stringify(reservationToCleanup));
    for (let resvLine of clonOfReserv.lines) {
      if (resvLine.requestMode === ReserveMode.ShipNode) {
        delete resvLine.distributionGroup;
      } else if (resvLine.requestMode === ReserveMode.DistGroup) {
        delete resvLine.shipNode;
      }
    }

    return clonOfReserv;
  }

  private deleteReservationLine(lineToDelete: ReservationRequestLine): void {

    ArrayUtil.removeObjectFromArray<ReservationRequestLine>(this.newReservation.lines, lineToDelete);

    const cloneOfNewReservation = JSON.parse(JSON.stringify(this.newReservation));

    this._newReservation = cloneOfNewReservation;
  }

  /**
   * Create a new blank reservatino line
   * @param rowIndex The 0 based index of the new reservation line. [0, 1, 2, ...]
   */
  private createNewReservationLine(rowIndex: number): ReservationRequestLine {
    return {
      deliveryMethod: 'SHP',
      distributionGroup: null,
      itemId: null,
      lineId: `${rowIndex + 1}.1`,
      productClass: 'NEW',
      quantity: 1,
      shipNode: null,
      unitOfMeasure: 'EACH',
      requestMode: ReserveMode.DistGroup,
    }
  }

  private _reservationListCache: BehaviorSubject<ReservationResponseLine[]>
    = new BehaviorSubject<ReservationResponseLine[]>(null);
  public get reservationListSubject(): Observable<ReservationResponseLine[]> {
    return this._reservationListCache;
  }

  
  public get resvTableColumns() : string[] {
    // "productClass", "unitOfMeasure","status", "reservationTs",
    return ["reference", "id",  "itemId",  "reservedQuantityExtn", "expirationTs"];
  }
  

  private _ReservationQueryModeRef: typeof ReservationQueryMode = ReservationQueryMode;
  public get ReservationQueryModeRef(): typeof ReservationQueryMode {
    return this._ReservationQueryModeRef;
  }

  public constructItemDesc(r: ReservationResponseLine): string {

    r.segment = r.segment ? r.segment.trim() : undefined;
    r.segmentType = r.segmentType ? r.segmentType.trim() : undefined;
     
    return            `Item    : ${r.itemId}\n`+
                      `P. Class: ${r.productClass}\n` +
     (r.segmentType ? `SgmtType: ${r.segmentType}\n` : '') +
     (r.segment ?     `Segemnt : ${r.segment}\n` : '');
  }

  public constructQuantityDesc(r: ReservationResponseLine): string {
    return                 `Qty  : ${r.reservedQuantity}\n` +
                           `UOM  : ${r.unitOfMeasure}\n` +
    (r.distributionGroup ? `DstGp: ${r.distributionGroup}\n`: '') +
    (r.shipNode ?          `ShpNd: ${r.shipNode}\n`: '');
  }

  public constructTimeStampDesc(r: ReservationResponseLine): string{
    return          `Rsv: ${r.reservationTs}\n` +
                    `Exp: ${r.expirationTs}\n` ;
  }

  public queryReservation(): void {

    if (this.reservationInquiry && (this.reservationInquiry.id || this.reservationInquiry.reference)) {

      const queryClone = JSON.parse(JSON.stringify(this.reservationInquiry));

      this.cleanQueryRequest(queryClone);

      // console.debug("Query Reservation: ", queryClone);

      this.reservationDataService.getReservation(queryClone).subscribe(
        (data: ReservationResponseLine[]) => {
          this._reservationListCache.next(data);
        }
      )
    }
  }

  private cleanQueryRequest(reservationInquiry: ReservationQuery): void {
    if (reservationInquiry.queryMode === ReservationQueryMode.Reference) {
      delete reservationInquiry.id;
    } else if (reservationInquiry.queryMode === ReservationQueryMode.Id) {
      delete reservationInquiry.reference;
    }
  }
}
