import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from './http-error-handler.service';


@Injectable({
  providedIn: 'root'
})

export abstract class IvServiceBase {

//   private shipnodeUrl = '/ivproxy/inventory/42dd13f4/v1' + "/configuration/shipNodes";
  
  private handleError: HandleError;

  // subclass provides the entity url like "configuration/shipNodes" or "supplies"
  abstract getEntityUrl() : string;

  // subclass provides the bearerToken
  abstract getBearerToken() : string;

  protected getBaseUrl = () => { return '/ivproxy/inventory/42dd13f4/v1'; }

  // need the http client to do CRUD operation
  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('IVRestService');
  }

  // get a list by REST GET. Caller specify the return type
  getList<T>(additionalUrl:string = '') : Observable<T[]>{

    let url = `${this.getBaseUrl()}/${this.getEntityUrl()}${additionalUrl}`;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'cache-control': 'no-cache',
        'Authorization': `Bearer ${this.getBearerToken()}`
      })
    };

    return this.http.get<T[]>( url, httpOptions)
    .pipe(
      catchError(this.handleError('getList', []))
    );
  }

  // addShipnode(data) {
  //   this.ELEMENT_DATA.push(data);
  // }

  // deleteShipnode(shipNode) {

  //   const index = this.ELEMENT_DATA.indexOf(shipNode, 0);

  //   if (index > -1) {
  //     this.ELEMENT_DATA = [...this.ELEMENT_DATA.slice(0, index), ...this.ELEMENT_DATA.slice(index + 1)];
  //   }
  // }

}
