import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {EntityUrl} from "../entity-url";

// // Credential 
// export interface Credent {
//   baseUrl?: string;
//   tenantID?: string;
//   appVersion: string;
//   clientID?: string;
//   clientSecret?: string;
// };

// export interface IVToken {
//   availabilityNetwork?: string;
//   configurationDistributionGroups?: string;
//   configurationSettings?: string;
//   configurationShipNodes?: string;
//   configurationThresholds?: string;
//   demands?: string;
//   reservations?: string;
//   supplies?: string;
// };

export interface IVCredent {
  baseUrl?: string;
  tenantID?: string;
  appVersion: string;
  clientID?: string;
  clientSecret?: string;
  tokens: {
    availabilityNetwork?: string;
    configurationDistributionGroups?: string;
    configurationSettings?: string;
    configurationShipNodes?: string;
    configurationThresholds?: string;
    demands?: string;
    reservations?: string;
    supplies?: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class CredentialDataService  {


  private credential: IVCredent = {baseUrl: EntityUrl.DEFAULT_URL_BASE, appVersion: "v1", tokens: {}};
  // private tokens: IVToken = {availabilityNetwork: 'NONE'};

  private handleError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) { 
  
    this.handleError = httpErrorHandler.createHandleError('CredentialDataService');
  }

  public getCredential = () => { return this.credential; }

  // public getTokens = () => { return this.tokens; }

  private getHttpOptions = () => {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        'Authorization': `Basic ${btoa(this.credential.clientID + ":" + this.credential.clientSecret)}`
      })
    }
  };

  public getIvBaseUrl(): string {

    if (this.credential == null || this.credential.baseUrl == null || this.credential.tenantID == null || 
      this.credential.appVersion == null || this.credential.clientID == null || this.credential.clientSecret == null) {
        return null;
      } else {
        return `${this.credential.baseUrl}/${this.credential.tenantID}/${this.credential.appVersion}`;
      }
   
  }

  public requestNetWorkAvailabilityToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.AVAILABILITY_NETWORK);
  }

  public requestDistributionGroupsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_DISTRIBUTIONGROUPS);
  }

  public requestSettingsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_SETTINGS);
  }

  public requestShipnodesToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_SHIPNODES);
  }

  public requestThresholdsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_THRESHOLDS);
  }

  public requestDemandsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.DEMANDS);
  }

  public requestReservationsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.RESERVATIONS);
  }

  public requestSuppliesToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.SUPPLIES);
  }


  private getToken(operationType: string) : Observable<any> {

    let baseUrl = this.getIvBaseUrl();

    if (baseUrl == null) {
      console.log("Credential is not set. can't get tokens");
      return null;
    } else {
      let url = `${baseUrl}/${operationType}/${EntityUrl.OATH_URL_SUFFIX}`;

      let httpOptions = this.getHttpOptions() ;

      return this.http.post( url, EntityUrl.OATH_REQUEST_BODY, httpOptions)
      .pipe(
        catchError(this.handleError(`get_${operationType}`, []))
      );
    }
  }
  
}
