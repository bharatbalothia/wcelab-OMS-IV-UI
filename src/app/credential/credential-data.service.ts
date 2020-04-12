import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

import { EntityUrl } from "../entity-url";
import { IvConstant } from "../iv-constant";

export interface IVCredent {
  baseUrl?: string;
  tenantID?: string;
  appVersion: string;
  clientID?: string;
  clientSecret?: string;
  tokens: {
    // availabilityNetwork?: string;
    // availabilityNode?: string;
    // configurationDistributionGroups?: string;
    // configurationSettings?: string;
    // configurationShipNodes?: string;
    // configurationThresholds?: string;
    // demands?: string;
    // reservations?: string;
    // supplies?: string;
    configuration?: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class CredentialDataService {


  private credential: IVCredent = {baseUrl: EntityUrl.DEFAULT_URL_BASE, appVersion: "v1", tokens: {}};
  // private tokens: IVToken = {availabilityNetwork: 'NONE'};

  private handleError: HandleError;


  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) { 
  
    this.handleError = httpErrorHandler.createHandleError('CredentialDataService');

  }

  public getCredential = () : IVCredent => { return this.credential; }

  // public getTokens = () => { return this.tokens; }

  public setCredential = (credent: IVCredent) : void => {
    this.credential = credent;
  }

  private getAuthHeader = ()  : {headers: HttpHeaders} => {

    if (this.credential.clientID && this.credential.clientSecret) {
      return {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
          'cache-control': 'no-cache',
          'Authorization': `Basic ${btoa(this.credential.clientID + ":" + this.credential.clientSecret)}`
        })
      };
    } else {
      console.error("No clientID or clientSecret. Cannot get tokens.");
      return  {
        headers: new HttpHeaders()
      };
    }
  };

  public getIvBaseUrl(): string {

    if (this.credential &&  
      this.credential.baseUrl &&
      this.credential.tenantID &&
      this.credential.appVersion) {
        return `${this.credential.baseUrl}/${this.credential.tenantID}/${this.credential.appVersion}`;
      } else {
        console.error('IV Credential is not complete. Missing baseUrl or tanantID or appVersion', this.credential);
        return null;
      }
   
  }

  public loadCredentFromStore(): void {
    let ivInfoString: string = localStorage.getItem(IvConstant.STORE_IV_INFO_AND_TOKEN);
    if (ivInfoString != null && ivInfoString.length > 0) {     
      let credentFromStore = JSON.parse(ivInfoString);
      console.info('Updating Credent from localStorage [%s].', IvConstant.STORE_IV_INFO_AND_TOKEN, credentFromStore);
      this.setCredential(credentFromStore);
    } else {
      console.info('No Credent found from localStorage [%s].', IvConstant.STORE_IV_INFO_AND_TOKEN);
    }
  }

  // Retrieve all tokens and store them into credentialStorage
  public reloadTokens():void {

    console.info('Removing store [%s]', IvConstant.STORE_IV_INFO_AND_TOKEN);

    localStorage.removeItem(IvConstant.STORE_IV_INFO_AND_TOKEN);

    let requestConfiguratoinToken : Observable<any> = this.requestConfiguratoinToken(this.credential);
    requestConfiguratoinToken.subscribe(
      data => {this.credential.tokens.configuration = data.access_token}
    );
    
    // let requestNetWorkAvailabilityToken : Observable<any> = this.requestNetWorkAvailabilityToken(this.credential);
    // requestNetWorkAvailabilityToken.subscribe(
    //   data => {this.credential.tokens.availabilityNetwork = data.access_token}
    // );

    // let requestNodeAvailabilityToken : Observable<any> = this.requestNodeAvailabilityToken(this.credential);
    // requestNodeAvailabilityToken.subscribe(
    //   data => {this.credential.tokens.availabilityNode = data.access_token}
    // );

    // let requestDistributionGroupsToken : Observable<any> = this.requestDistributionGroupsToken(this.credential);
    // requestDistributionGroupsToken.subscribe(
    //   data => {this.credential.tokens.configurationDistributionGroups = data.access_token}
    // );

    // let requestSettingsToken : Observable<any> = this.requestSettingsToken(this.credential);
    // requestSettingsToken.subscribe(
    //   data => {this.credential.tokens.configurationSettings = data.access_token}
    // );

    // let requestShipnodesToken : Observable<any> = this.requestShipnodesToken(this.credential);
    // requestShipnodesToken.subscribe(
    //   data => {this.credential.tokens.configurationShipNodes = data.access_token}
    // );

    // let requestThresholdsToken : Observable<any> = this.requestThresholdsToken(this.credential);
    // requestThresholdsToken.subscribe(
    //   data => {this.credential.tokens.configurationThresholds = data.access_token}
    // );

    // let requestDemandsToken : Observable<any> = this.requestDemandsToken(this.credential);
    // requestDemandsToken.subscribe(
    //   data => {this.credential.tokens.demands = data.access_token}
    // );

    // let requestReservationsToken : Observable<any> = this.requestReservationsToken(this.credential);
    // requestReservationsToken.subscribe(
    //   data => {this.credential.tokens.reservations = data.access_token}
    // );

    // let requestSuppliesToken : Observable<any> = this.requestSuppliesToken(this.credential);
    // requestSuppliesToken.subscribe(
    //   data => {this.credential.tokens.supplies = data.access_token}
    // );

    // Use forkJoin to write to the localstorage after recevied all tokens.
    forkJoin(
      requestConfiguratoinToken,
      // requestDistributionGroupsToken,
      // requestSettingsToken,
      // requestShipnodesToken,
      // requestThresholdsToken,
      // requestDemandsToken,
      // requestReservationsToken,
      // requestSuppliesToken,
      // requestNodeAvailabilityToken,
      // requestNetWorkAvailabilityToken,
    ).subscribe(
      data => {
        let safeCopyCredent : IVCredent = 
          this.getCopyOfCredentialWithoutClientIdOrSecret();
        let ivInfoToStore: string = JSON.stringify(safeCopyCredent);
        console.info('Saving to store [%s]', IvConstant.STORE_IV_INFO_AND_TOKEN, ivInfoToStore)
        localStorage.setItem(IvConstant.STORE_IV_INFO_AND_TOKEN, ivInfoToStore);
      }
    );
  }

  private getCopyOfCredentialWithoutClientIdOrSecret = () : IVCredent => {
    let copyOfCredent = JSON.parse(JSON.stringify(this.getCredential()));
    copyOfCredent.clientID = null;
    copyOfCredent.clientSecret = null;
    return copyOfCredent;
  }
  
  private requestConfiguratoinToken(credential: IVCredent) : Observable<any>{
    return this.getToken(EntityUrl.CONFIGURATION);
  }

  // private requestNetWorkAvailabilityToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.AVAILABILITY_NETWORK);
  // }

  // private requestNodeAvailabilityToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.AVAILABILITY_NODE);
  // }

  // private requestDistributionGroupsToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.CONFIGURATION_DISTRIBUTIONGROUPS);
  // }

  // private requestSettingsToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.CONFIGURATION_SETTINGS);
  // }

  // private requestShipnodesToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.CONFIGURATION_SHIPNODES);
  // }

  // private requestThresholdsToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.CONFIGURATION_THRESHOLDS);
  // }

  // private requestDemandsToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.DEMANDS);
  // }

  // private requestReservationsToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.RESERVATIONS);
  // }

  // private requestSuppliesToken(credential: IVCredent) : Observable<any>{
  //   return this.getToken(EntityUrl.SUPPLIES);
  // }


  private getToken(operationType: string) : Observable<any> {

    let baseUrl = this.getIvBaseUrl();

    if (baseUrl) {
      let url = `${baseUrl}/${operationType}/${EntityUrl.OATH_URL_SUFFIX}`;

      let httpOptions = this.getAuthHeader() ;

      return this.http.post( url, EntityUrl.OATH_REQUEST_BODY, httpOptions)
      .pipe(
        catchError(this.handleError(`get_${operationType}`, []))
      );
    } else {
      console.warn("Credential is not set. can't get tokens");
      return null;      
    }
  }
}
