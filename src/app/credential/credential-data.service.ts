import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {EntityUrl} from "../entity-url";

// Credential 
export interface Credent {
  baseUrl?: string;
  tenantID?: string;
  appVersion: string;
  clientID?: string;
  clientSecret?: string;
};

export interface IVToken {
  availabilityNetwork?: string;
  configurationDistributionGroups?: string;
  configurationSettings?: string;
  configurationShipNodes?: string;
  configurationThresholds?: string;
  demands?: string;
  reservations?: string;
  supplies?: string;
};


@Injectable({
  providedIn: 'root'
})
export class CredentialDataService  {


  private credential: Credent = {baseUrl: "https://eu-api.watsoncommerce.ibm.com/inventory", appVersion: "v1"};
  private tokens: IVToken = {availabilityNetwork: 'NONE'};

  private handleError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) { 
  
    this.handleError = httpErrorHandler.createHandleError('CredentialDataService');
  }

  public getCredential = () => { return this.credential; }

  public getTokens = () => { return this.tokens; }

  private getHttpOptions = (credential: Credent) => {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        'Authorization': `Basic ${btoa(credential.clientID + ":" + credential.clientSecret)}`
      })
    }
  };

  public getNetWorkAvailabilityToken(credential: Credent) : Observable<any>{
    
  
    let url = `${credential.baseUrl}/${credential.tenantID}/${credential.appVersion}/${EntityUrl.AVAILABILITY_NETWORK}/${EntityUrl.OATH_URL_SUFFIX}`;

    let httpOptions = this.getHttpOptions(credential) ;

    return this.http.post( url, EntityUrl.OATH_REQUEST_BODY, httpOptions)
    .pipe(
      catchError(this.handleError('getNetWorkAvailabilityToken', []))
    );
  }
  
}
