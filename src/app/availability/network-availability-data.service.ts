import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpErrorHandler } from '../http-error-handler.service';

import { IvServiceBase } from '../iv-service-base.service';
import { IvConstant } from '../iv-constant';
import { EntityUrl } from '../entity-url';
import { IVCredent, CredentialDataService } from '../credential/credential-data.service';
import { AvaiabilityInquiry, NetworkAvailability } from './availability-data.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkAvailabilityDataService extends IvServiceBase {

  constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
   }

  
  public getBearerToken = (credential: IVCredent)  => {
    return credential == null ? null : credential.tokens.availabilityNetwork; 
  }

  getEntityUrl(): string {
    return EntityUrl.AVAILABILITY_NETWORK;
  }

  getNetworkAvailability(inquiry: AvaiabilityInquiry): Observable<NetworkAvailability> {
    return this.postObject<AvaiabilityInquiry>(inquiry);
  }
}
