import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

import {EntityUrl} from "../entity-url";

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
export class CredentialDataService {


  private credential: IVCredent = {baseUrl: EntityUrl.DEFAULT_URL_BASE, appVersion: "v1", tokens: {}};
  // private tokens: IVToken = {availabilityNetwork: 'NONE'};

  private handleError: HandleError;


  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler, private router: Router) { 
  
    this.handleError = httpErrorHandler.createHandleError('CredentialDataService');

    const routerUrl = this.router.url;

    console.debug('Router for credential-data is: ', routerUrl);

  }

  public getCredential = () : IVCredent => { return this.credential; }

  // public getTokens = () => { return this.tokens; }

  public setCredential = (credent: IVCredent) : void => {
    this.credential = credent;
  }

  private getAuthHeader = ()  : {headers: HttpHeaders} => {

    if (this.credential.clientID == null || this.credential.clientID.length == 0 ||
      this.credential.clientSecret == null || this.credential.clientSecret.length == 0) {
      console.error("No clientID or clientSecret. Cannot get tokens.");
      return  {
        headers: new HttpHeaders()
      };
    } else {
      return {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
          'cache-control': 'no-cache',
          'Authorization': `Basic ${btoa(this.credential.clientID + ":" + this.credential.clientSecret)}`
        })
      };
    }
  };

  public getIvBaseUrl(): string {

    if (this.credential == null || 
      this.credential.baseUrl == null || this.credential.baseUrl.length == 0 ||
      this.credential.tenantID == null || this.credential.tenantID.length == 0 ||
      this.credential.appVersion == null || this.credential.appVersion.length == 0) {
        console.error('IV Credential is not complete. Missing baseUrl or tanantID or appVersion', this.credential);
        return null;
      } else {
        return `${this.credential.baseUrl}/${this.credential.tenantID}/${this.credential.appVersion}`;
      }
   
  }

  public loadCredentFromStore(): void {
    let ivInfoString: string = localStorage.getItem(EntityUrl.STORE_IV_INFO_AND_TOKEN);
    if (ivInfoString != null && ivInfoString.length > 0) {     
      let credentFromStore = JSON.parse(ivInfoString);
      console.info('Updating Credent from localStorage [%s].', EntityUrl.STORE_IV_INFO_AND_TOKEN, credentFromStore);
      this.setCredential(credentFromStore);
    } else {
      console.info('No Credent found from localStorage [%s].', EntityUrl.STORE_IV_INFO_AND_TOKEN);
    }
  }

  // Retrieve all tokens and store them into credentialStorage
  public reloadTokens():void {

    console.info('Removing store [%s]', EntityUrl.STORE_IV_INFO_AND_TOKEN);

    localStorage.removeItem(EntityUrl.STORE_IV_INFO_AND_TOKEN);

    // TODO: check if the logic below is correct. 
    // the code currently subscribe to each Observable twice
    //  once in the code just below to process the data
    //  another time to forkJoin all Observables to get a JSON of updated credentials 
    //  to update the localStorage.
    //  Will the first subscrib trigger the execution of the request? 
    //  If so, could the the request complete before the starting of forkJoin? 
    //  Will that cuase the forJoin to never complete?
    
    let requestNetWorkAvailabilityToken : Observable<any> = this.requestNetWorkAvailabilityToken(this.credential);
    requestNetWorkAvailabilityToken.subscribe(
      data => {this.credential.tokens.availabilityNetwork = data.access_token}
    );

    let requestDistributionGroupsToken : Observable<any> = this.requestDistributionGroupsToken(this.credential);
    requestDistributionGroupsToken.subscribe(
      data => {this.credential.tokens.configurationDistributionGroups = data.access_token}
    );

    let requestSettingsToken : Observable<any> = this.requestSettingsToken(this.credential);
    requestSettingsToken.subscribe(
      data => {this.credential.tokens.configurationSettings = data.access_token}
    );

    let requestShipnodesToken : Observable<any> = this.requestShipnodesToken(this.credential);
    requestShipnodesToken.subscribe(
      data => {this.credential.tokens.configurationShipNodes = data.access_token}
    );

    let requestThresholdsToken : Observable<any> = this.requestThresholdsToken(this.credential);
    requestThresholdsToken.subscribe(
      data => {this.credential.tokens.configurationThresholds = data.access_token}
    );

    let requestDemandsToken : Observable<any> = this.requestDemandsToken(this.credential);
    requestDemandsToken.subscribe(
      data => {this.credential.tokens.demands = data.access_token}
    );

    let requestReservationsToken : Observable<any> = this.requestReservationsToken(this.credential);
    requestReservationsToken.subscribe(
      data => {this.credential.tokens.reservations = data.access_token}
    );

    let requestSuppliesToken : Observable<any> = this.requestSuppliesToken(this.credential);
    requestSuppliesToken.subscribe(
      data => {this.credential.tokens.supplies = data.access_token}
    );

    forkJoin(
      requestDistributionGroupsToken,
      requestSettingsToken,
      requestShipnodesToken,
      requestThresholdsToken,
      requestDemandsToken,
      requestReservationsToken,
      requestSuppliesToken
    ).subscribe(
      any => {
        let safeCopyCredent : IVCredent = 
          this.getCopyOfCredentialWithoutClientIdOrSecret();
        let ivInfoToStore: string = JSON.stringify(safeCopyCredent);
        console.info('Saving to store [%s]', EntityUrl.STORE_IV_INFO_AND_TOKEN, ivInfoToStore)
        localStorage.setItem(EntityUrl.STORE_IV_INFO_AND_TOKEN, ivInfoToStore);
      }
    );
  }

  private getCopyOfCredentialWithoutClientIdOrSecret = () : IVCredent => {
    let copyOfCredent = JSON.parse(JSON.stringify(this.getCredential()));
    copyOfCredent.clientID = null;
    copyOfCredent.clientSecret = null;
    return copyOfCredent;
  }
  
  private requestNetWorkAvailabilityToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.AVAILABILITY_NETWORK);
  }

  private requestDistributionGroupsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_DISTRIBUTIONGROUPS);
  }

  private requestSettingsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_SETTINGS);
  }

  private requestShipnodesToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_SHIPNODES);
  }

  private requestThresholdsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION_THRESHOLDS);
  }

  private requestDemandsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.DEMANDS);
  }

  private requestReservationsToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.RESERVATIONS);
  }

  private requestSuppliesToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.SUPPLIES);
  }


  private getToken(operationType: string) : Observable<any> {

    let baseUrl = this.getIvBaseUrl();

    if (baseUrl == null) {
      console.warn("Credential is not set. can't get tokens");
      return null;
    } else {
      let url = `${baseUrl}/${operationType}/${EntityUrl.OATH_URL_SUFFIX}`;

      let httpOptions = this.getAuthHeader() ;

      return this.http.post( url, EntityUrl.OATH_REQUEST_BODY, httpOptions)
      .pipe(
        catchError(this.handleError(`get_${operationType}`, []))
      );
    }
  }
}
