import { Component, OnInit, Input } from '@angular/core';

import { AvailabilityInquiry, AvailabilityResult } from "../availability-data.service";

import {Observable} from "rxjs";

@Component({
  selector: 'app-ava-viewer',
  templateUrl: './ava-viewer.component.html',
  styleUrls: ['./ava-viewer.component.less']
})
export class AvaViewerComponent implements OnInit {

  constructor() { }



  @Input() 
  public get requestSubject(): Observable<AvailabilityInquiry> {
    return this._requestSubject;
  }
  public set requestSubject(v : Observable<AvailabilityInquiry>) {
    this._requestSubject = v;
  }
  private _requestSubject: Observable<AvailabilityInquiry>;

  @Input() 
  public get responseSubject() : Observable<AvailabilityResult> {
    return this._responseSubject;
  }
  public set responseSubject(v : Observable<AvailabilityResult>) {
    this._responseSubject = v;
  }
  private _responseSubject: Observable<AvailabilityResult>;
 
  
  @Input() 
  public get request(): AvailabilityInquiry {
    return this._request || {lines: []};
  }
  public set request(v : AvailabilityInquiry) {
    console.debug('Setting _request to: ', v);
    this._request = v;
  }
  private _request: AvailabilityInquiry;

  @Input() 
  public get response() : AvailabilityResult {
    return this._response || {lines: [{lineId: 1}]};
  }
  public set response(v : AvailabilityResult) {
    console.debug('Setting _response to: ', v);
    this._response = v;
  }
  private _response: AvailabilityResult;


  ngOnInit() {
    this._requestSubject.subscribe(
      (data: AvailabilityInquiry) =>
        this.request = data
    );

    this._responseSubject.subscribe(
      (data: AvailabilityResult) =>
        this.response = data
    );
  }

}
