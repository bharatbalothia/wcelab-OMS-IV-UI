import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import {IvServiceBase} from "../iv-service-base.service";

import {EntityUrl} from "../entity-url";

import {IVCredent, CredentialDataService} from "../credential/credential-data.service";

export interface ShipNode {
  shipNode: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})

export class ShipnodeDataService extends IvServiceBase {

  shipnodeSubject: BehaviorSubject<ShipNode[]> = new BehaviorSubject<ShipNode[]>([]);

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  public getEntityUrl = () => { return EntityUrl.CONFIGURATION_SHIPNODES; }

  public getBearerToken = (credential: IVCredent)  => {
    // console.log(`credential to use: ${JSON.stringify(credential)}`);
    return credential == null ? null : credential.tokens.configurationShipNodes; 
  }

  // private data: ShipNode[];
  // private observable: Observable<ShipNode[]> = of(this.data);


  // private fackeShipnodes : ShipNode[] = [{    shipNode: 'junk_shipnode',
  //     latitude: 100,
  //     longitude: 100}];

  getShipnodeList() : Observable<ShipNode[]> {

    return this.shipnodeSubject;

    // return this.getList<ShipNode>();

    // this.getList<ShipNode>().subscribe((nodes: ShipNode[]) => {
    //   this.data = nodes;
    //   console.log(`got nodes: ${this.data}`);
    // });

    
    // // if (this.observable == null) {
    // //   this.observable = this.getList<ShipNode>();
    // // }

    // // return this.observable;

    // return this.observable;
  }

  getAllShipnodes(): void{
    this.getList<ShipNode>().subscribe(data => {
      this.shipnodeSubject.next(data);
    });
  }

  putShipnode(data: ShipNode) {

    console.log (`create or update shipndoe: ${data.shipNode} [${data.latitude}, ${data.longitude}]`);
    
    this.putObject<ShipNode>(data, '/' + encodeURIComponent(data.shipNode));

  }

  deleteShipnode(data: ShipNode) {

    console.log (`delete shipndoe: ${data.shipNode} [${data.latitude}, ${data.longitude}]`);
    
    this.deleteObject('/' + encodeURIComponent(data.shipNode));

  }

}
