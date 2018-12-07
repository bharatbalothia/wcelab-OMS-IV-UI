
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from './http-error-handler.service';

import { IVCredent, CredentialDataService } from './credential/credential-data.service';


/**
 * Base class for REST data Access.
 * This base class provides the REST operations.
 */
export abstract class IvServiceBase {
  
  private handleError: HandleError;

  /**
   * subclass provides the entity url like "configuration/shipNodes" or "supplies"
   */
  protected abstract getEntityUrl() : string;

  /**
   * subclass provides the bearerToken
   * @param credential the credentail. IvServiceBase
   * passes the current credentail when invoiking this function.
   */
  protected abstract getBearerToken(credential: IVCredent) : string;

  // need the http client to do CRUD operation
  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler, private credentialData: CredentialDataService) {
    this.handleError = httpErrorHandler.createHandleError('iv-service-base');
  }

  private getUrl = (additionalUrl:string): string => {
    let baseUrl = this.credentialData.getIvBaseUrl();
    return baseUrl ? `${baseUrl}/${this.getEntityUrl()}${additionalUrl}` : null;
  };

  private getHttpOptions = (httpParams? : HttpParams): {headers: HttpHeaders, params?: HttpParams} => {

    let option = httpParams ? {
      headers: this.getHeader(),
      params: httpParams
    } : {
      headers: this.getHeader()
    };

    return option;
  };

  private getHeader(): HttpHeaders{
    
    let headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'cache-control': 'no-cache'
      });
    
    let bearerToken = this.getBearerToken(this.credentialData.getCredential());

    if (bearerToken == null) {
      console.warn('Failed to obtain Bearer Token for %s', this.constructor.name, 
        this.credentialData.getCredential());
    } else {
      // HttpHeaders.set is not mutable. Need to use the return value.
      headers = headers.set('Authorization', `Bearer ${bearerToken}`);
    }

    return headers;
  }

  // get a list by REST GET.
  protected getList<T>(additionalUrl: string = '', params?: any) : Observable<any>{

    return this.getObject<T[]>(additionalUrl, params);
  
  }

  protected putObject<T>(objectToPut: T, additionalUrl:string = '') : Observable<any> {

    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions();

    console.debug('Put object to %s', url, objectToPut);

    let putResult = this.http.put(url, objectToPut, httpOptions).pipe(
      catchError(this.handleError('putObject', []))
    );
        
    return putResult;
  }
  
  protected postObject<T>(objectToPut: T, additionalUrl:string = '') : Observable<any> {

    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions();

    console.debug('Post object to %s', url, objectToPut);

    let postResult = this.http.post(url, objectToPut, httpOptions).pipe(
      catchError(this.handleError('putObject', []))
    );
    
    return postResult;
  }

  protected getObject<T>(additionalUrl: string = '', params?: any) : Observable<any> {

    let url = this.getUrl(additionalUrl);

    let httpParams: HttpParams = (params == null) ? null : new HttpParams({ fromObject: params});

    let httpOptions = this.getHttpOptions(httpParams);

    console.debug('Requesting object from url: "%s" with options: ', url, httpOptions);

    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError('putObject', []))
    );
  }

  protected deleteObject(additionalUrl:string) : Observable<any> {
    let url = this.getUrl(additionalUrl);

    let httpOptions = this.getHttpOptions();

    console.debug(`Deleting object on ${url}`);

    let deleteResult = this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError('deleteObject', []))
    );
    
    return deleteResult;
  }

}
