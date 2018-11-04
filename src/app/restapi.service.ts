import { Injectable } from '@angular/core';

import { HttpClient} from  '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})

export class RestapiService {

  // API_URL = "/ivproxy/inventory/42dd13f4/v1";

  // constructor(private  httpClient:  HttpClient) {}

  // getShipnodes() : Observable<any> {

  // let shipnodes = 
  //   this.httpClient.get(`${this.API_URL}/configuration/shipNodes`)
  //   .map(response =>  {
  //   // when the cached data is available we don't need the `Observable` reference anymore
  //   this.observable = null;

  //   if(response.status == 400) {
  //     return "FAILURE";
  //   } else if(response.status == 200) {
  //     this.data = new Data(response.json());
  //     return this.data;
  //   }
  //   // make it shared so more than one subscriber can get the result
  // })
  // .share();

  
  // return shipnodes;

  // }

  
}
