import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from './http-error-handler.service';

import {IVCredent, CredentialDataService} from './credential/credential-data.service';


export abstract class IvServiceBase {
  
  private handleError: HandleError;

  // subclass provides the entity url like "configuration/shipNodes" or "supplies"
  abstract getEntityUrl() : string;

  // subclass provides the bearerToken
  abstract getBearerToken(credential: IVCredent) : string;

  // protected getBaseUrl = () => { return '/ivproxy/inventory/42dd13f4/v1'; }

  // need the http client to do CRUD operation
  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler, private credentialData: CredentialDataService) {
    this.handleError = httpErrorHandler.createHandleError('IVRestService');
  }

  private getUrl = (additionalUrl:string) => {
    let baseUrl = this.credentialData.getIvBaseUrl();
    return baseUrl == null ? null : `${baseUrl}/${this.getEntityUrl()}${additionalUrl}`;
  };

  private getHttpOptions = () => {

    let bearerToken = this.getBearerToken(this.credentialData.getCredential()); 

    return bearerToken == null ? null : {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'cache-control': 'no-cache',
        'Authorization': `Bearer ${bearerToken}`
      })
    }
  };

  // get a list by REST GET. Caller specify the return type
  getList<T>(additionalUrl:string = '') : Observable<T[]>{

    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions() ;

    if (url == null || httpOptions == null) {
      return null; 
    } else {
      return this.http.get<T[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError('getList', []))
      );
   }
  }

  putObject<T>(objectToPut: T, additionalUrl:string = '') : Observable<any> {

    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions();

    console.log(`About to put object to ${url}`);

    let putResult = this.http.put(url, objectToPut, httpOptions).pipe(
      catchError(this.handleError('putObject', []))
    ); 

    console.log(`finished calling put object to ${url}`);
    
    // Put an empty subscriber here to avoid angular not executing put without
    // a subscriber.
    putResult.subscribe();
    
    // putResult.subscribe(
    //   data => {console.log(data), error => {console.error(error)}}
    // );
    
    return putResult;
  }
  
  getObject<T>(additionalUrl:string = '') : Observable<any> {

    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions();

    console.log(`About to get object from ${url}`);

    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError('putObject', []))
    );
  }

  deleteObject(additionalUrl:string) : Observable<any> {
    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions();

    console.log(`About to delete object on ${url}`);

    let deleteResult = this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError('deleteObject', []))
    ); 
    
    // Put an empty subscriber here to avoid angular not executing put without
    // a subscriber.
    deleteResult.subscribe();
    
    // putResult.subscribe(
    //   data => {console.log(data), error => {console.error(error)}}
    // );
    
    return deleteResult;
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
