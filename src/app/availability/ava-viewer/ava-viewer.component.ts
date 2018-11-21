import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { formatDate } from "@angular/common";

import { AvailabilityInquiry, AvailabilityResult } from "../availability-data.service";

import { Observable,BehaviorSubject } from "rxjs";
import { DateUtil } from "../../util/date-util";
import { stringify } from 'querystring';
import { ShipNodeSupply, ItemSupply } from 'src/app/supply/supply-data.service';

import { BaseChartDirective } from "ng2-charts";

@Component({
  selector: 'app-ava-viewer',
  templateUrl: './ava-viewer.component.html',
  styleUrls: ['./ava-viewer.component.less']
})
export class AvaViewerComponent implements OnInit {

  //========= Getters and Setters ==============================
  @Input()
  public get requestSubject(): Observable<AvailabilityInquiry> {
    return this._requestSubject;
  }
  public set requestSubject(v: Observable<AvailabilityInquiry>) {
    this._requestSubject = v;
  }
  private _requestSubject: Observable<AvailabilityInquiry>;

  @Input()
  public get responseSubject(): Observable<AvailabilityResult> {
    return this._responseSubject;
  }
  public set responseSubject(v: Observable<AvailabilityResult>) {
    this._responseSubject = v;
  }
  private _responseSubject: Observable<AvailabilityResult>;


  @Input()
  public get request(): AvailabilityInquiry {
    return this._request || { lines: [] };
  }
  public set request(v: AvailabilityInquiry) {
    console.debug('Setting _request to: ', v);
    this._request = v;
  }
  private _request: AvailabilityInquiry;

  @Input()
  public get response(): AvailabilityResult {
    return this._response || { lines: [{ lineId: 1 }] };
  }
  public set response(v: AvailabilityResult) {
    console.debug('Setting _response to: ', v);
    this._response = v;
  }
  private _response: AvailabilityResult;

  public get availabilityMessage(): Observable<string> {
    return this._availabilityMessage;
  }
  private _availabilityMessage: BehaviorSubject<string> = new BehaviorSubject<string>("");

  //========= End of Getters and Setters ========================

  @ViewChild("baseChart")
  chart: BaseChartDirective;

  constructor() { }

  /**
   * Initialize the ng component of the viewer.
   * Setup the subscription to Availability Request & Result.
   */
  ngOnInit() {

    this._requestSubject.subscribe(
      (data: AvailabilityInquiry) =>
        this.request = data
    );

    this._responseSubject.subscribe(
      (data: AvailabilityResult) =>
        this.displayAvailability(data)
    );
  }

  /**
   * Display the availability result
   * @param availability the availability result to be displayed
   */
  private displayAvailability(availability: AvailabilityResult) {

    console.debug('Processing availability data of: ', availability);
    this.response = availability;

    const invChart: SupplyChartEntry[] = [] as SupplyChartEntry[];

    // Now use week as time period
    const startingPoint: Date = DateUtil.getStartOfTheWeek(new Date());
    const periodDuration = 1000 * 60 * 60 * 24 * 7; // one period is 7 days

    // Process next 8 weeks of data
    const numberOfPeriod = 8;

    for (let avaLine of availability.lines) {
      if (avaLine.networkAvailabilities) {
        const avaOverTime: ItemSupply[][] = [] as ItemSupply[][];
        for (let netAvaLine of avaLine.networkAvailabilities) {
          
          const availabilityText: string = 
          `Onhand: ${netAvaLine.onhandAvailableQuantity} Future: ${netAvaLine.futureAvailableQuantity} after ${formatDate(netAvaLine.futureEarliestShipTs, 'yyyy-MM-dd', 'en-US', 'UTC')}`;
          this._availabilityMessage.next(availabilityText);

          for (let supplyDtl of netAvaLine.supplyDetail) {
            const thisSupplyArray: ItemSupply[] = new Array<ItemSupply>(numberOfPeriod);
            for (let supplyEntry of supplyDtl.supplies) {
              let periodOfEntry = Math.floor((new Date(supplyEntry.eta).valueOf() - startingPoint.valueOf()) / periodDuration);
              if (periodOfEntry < 0) {
                periodOfEntry = 0;
              }
              thisSupplyArray[periodOfEntry] = supplyEntry;
            }
            avaOverTime.push(thisSupplyArray);
          }
        }
        console.debug("Finished creating 2D array for the supplies: ", avaOverTime);
        this.drawChart(startingPoint, periodDuration, numberOfPeriod, avaOverTime);
      }
    }


    // if (availability && availability.inquiryHeader && availability.lines && availability.lines[0].inquiryLine) {
    //   const labels: string[] = [] as string[];

    //   for (let resultLine of availability.lines) {
    //     labels.push(`${resultLine.inquiryLine.itemId} ${resultLine.inquiryLine.unitOfMeasure}`);
    //   }
    // }
  }

  private drawChart(startingPoint: Date, periodDuration: number, numberOfPeriod: number, avaOverTime: ItemSupply[][]) {
    const xlabels: string[] = [] as string[];
    const chartData: { label: string; stack: string; data: number[] }[] = [] as { label: string; stack: string; data: number[] }[];
    for (let tp = 0; tp < numberOfPeriod; tp++) {
      xlabels[tp] = formatDate(new Date(startingPoint.valueOf() + periodDuration * tp), "yyyy-MM-dd", "en-US", "UTC");

      for (let sn = 0; sn < avaOverTime.length; sn++) {
        // Loop through the supply lines
        const itemSupplyAdj: number = avaOverTime[sn][tp] ? avaOverTime[sn][tp].quantity : 0;
        const onhandAdj = (itemSupplyAdj != 0 && avaOverTime[sn][tp].type == "ONHAND") ? itemSupplyAdj : 0;
        const futureAdj = (itemSupplyAdj != 0 && avaOverTime[sn][tp].type != "ONHAND") ? itemSupplyAdj : 0;
        const previousOnHandSupplyLevel: number = (tp > 0) ? chartData[2*sn].data[tp - 1] : 0;
        const previousFutureSupplyLevel: number = (tp > 0) ? chartData[2*sn+1].data[tp - 1] : 0;
        
        if (!chartData[2*sn]) {
          const numarray0: number[] = [] as number[];
          const numarray1: number[] = [] as number[];
          // The onhand serie
          chartData[2*sn] = { label: null, stack: null, data: numarray0 };
          // The future serie
          chartData[2*sn+1] = { label: null, stack: null, data: numarray1 };
        }
        
        chartData[2*sn].data[tp] = previousOnHandSupplyLevel + onhandAdj;
        chartData[2*sn+1].data[tp] = previousFutureSupplyLevel + futureAdj;
        
        if (!chartData[2*sn].label && avaOverTime[sn][tp]) {
          chartData[2*sn].label = avaOverTime[sn][tp].shipNode + " onhand";
          chartData[2*sn].stack = sn.toString();
          chartData[2*sn+1].label = avaOverTime[sn][tp].shipNode + " future";
          chartData[2*sn+1].stack = sn.toString();
        }
      }
    }

    console.debug('Chart data ready: ', xlabels, chartData);

    this.chart.labels = xlabels;
    this.chart.data = chartData;

    this.chart.chartType = "bar";

    this.chart.labels = xlabels;
    this.chart.datasets = chartData;

    this.redrawChart();

  }
  //********************************** 
  //** Bar chart's data
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };

  // public barChartLabels: string[] = ["2017-11-18", "2017-11-25", "2017-12-02", "2017-12-09", "2017-12-16", "2017-12-23", "2017-12-30", "2018-01-06", "2018-01-13", "2018-01-20", "2018-01-27", "2018-02-03"];

  // public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  // public barChartData: any[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series C' }
  // ];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  private redrawChart() {
    if (this.chart !== undefined) {
      this.chart.ngOnDestroy();
      this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
    }

  }

}

interface SupplyChartEntry {
  timePeriod: number;
  shipNode: string;
  supplies: [{
    type: string;
    quantity: number;
  }],
  demandQuantity: number;
}
