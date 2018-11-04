import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import {ShipNode} from '../datatype/ShipNode';

import {IvServiceBase} from "../iv-service-base.service";

// import {RestapiService} from '../restapi.service';



@Injectable({
  providedIn: 'root'
})

export class ShipnodeDataService extends IvServiceBase {

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    super(http, httpErrorHandler);
  }

  public getEntityUrl = () => { return "/configuration/shipNodes"; }

  public getBearerToken = ()  => { return 'K5UFv2CvlTGgdrFNnoaUfYM4ps37kb5z'; }


  // private shipnodeUrl = '/ivproxy/inventory/42dd13f4/v1' + "/configuration/shipNodes";
  // private handleError: HandleError;

  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer K5UFv2CvlTGgdrFNnoaUfYM4ps37kb5z'
  //   })
  // };

  // // need the http client to do CRUD operation
  // constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
  //   this.handleError = httpErrorHandler.createHandleError('HeroesService');
  // }

  // // GET shipnodes from the IV server
  // getShipNodeFromIV (): Observable<ShipNode[]> {
  //   return this.http.get<ShipNode[]>(this.shipnodeUrl, this.httpOptions)
  //     .pipe(
  //       catchError(this.handleError('getShipNodeFromIV', []))
  //     );
  // }
  
  // // private data: ShipNode[];
  private observable: Observable<ShipNode[]>;


  getData() : Observable<ShipNode[]> {
    // if(this.data) {
    //   // if `data` is available just return it as `Observable`
    //   return of(this.data); 
    // } else 
    if(this.observable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.observable;
    } else {
    
      this.observable = this.getList<ShipNode>('');

      return this.observable;

    }
  }

  // // addShipnode(data) {
  // //   this.ELEMENT_DATA.push(data);
  // // }

  // // deleteShipnode(shipNode) {

  // //   const index = this.ELEMENT_DATA.indexOf(shipNode, 0);

  // //   if (index > -1) {
  // //     this.ELEMENT_DATA = [...this.ELEMENT_DATA.slice(0, index), ...this.ELEMENT_DATA.slice(index + 1)];
  // //   }
  // // }

}
