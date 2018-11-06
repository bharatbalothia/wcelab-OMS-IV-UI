import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import {ShipNode} from '../datatype/ShipNode';

import {IvServiceBase} from "../iv-service-base.service";


@Injectable({
  providedIn: 'root'
})


// TODO: Need to check if this is a singular service for all ShipNodeData needs. 
// single ShipnodeDataService instance avoids additional REST calls. Typescript has shared service. 
export class ShipnodeDataService extends IvServiceBase {

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    super(http, httpErrorHandler);
  }

  public getEntityUrl = () => { return "configuration/shipNodes"; }

  public getBearerToken = ()  => { return 'YvAuIqChPIQfL4SVNScSXCAWBMCgBCJD'; }

  // private data: ShipNode[];
  private observable: Observable<ShipNode[]>;


  // private fackeShipnodes : ShipNode[] = [{    shipNode: 'junk_shipnode',
  //     latitude: 100,
  //     longitude: 100}];

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
    
      
      this.observable = this.getList<ShipNode>();

      // this.observable = of(this.fackeShipnodes);

      return this.observable;

    }
  }

  addShipnode(data: ShipNode) {

    console.log (`try to add shipndoe: ${data.shipNode} [${data.latitude}, ${data.longitude}]`);
    
    this.putObject<ShipNode>(data, '/' + encodeURIComponent(data.shipNode));

  }

  deleteShipnode(data: ShipNode) {

    console.log (`try to delete shipndoe: ${data.shipNode} [${data.latitude}, ${data.longitude}]`);
    
    this.deleteObject('/' + encodeURIComponent(data.shipNode));

  }

}
