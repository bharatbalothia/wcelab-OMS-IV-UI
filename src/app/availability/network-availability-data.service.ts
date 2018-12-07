import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpErrorHandler } from '../http-error-handler.service';

import { IvServiceBase } from '../iv-service-base.service';
import { IvConstant } from '../iv-constant';
import { EntityUrl } from '../entity-url';
import { IVCredent, CredentialDataService } from '../credential/credential-data.service';
import { AvailabilityInquiry, AvailabilityResult } from './availability-data.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkAvailabilityDataService extends IvServiceBase {

  constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
   }

  
   protected getBearerToken = (credential: IVCredent)  => {
    return credential ? credential.tokens.availabilityNetwork : null; 
  }

  protected getEntityUrl(): string {
    return EntityUrl.AVAILABILITY_NETWORK;
  }

  getNetworkAvailability(inquiry: AvailabilityInquiry): Observable<AvailabilityResult> {
    return this.postObject<AvailabilityInquiry>(inquiry);
  }
}
