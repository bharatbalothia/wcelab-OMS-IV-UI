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

  private shipnodeSubject: BehaviorSubject<ShipNode[]> = new BehaviorSubject<ShipNode[]>([]);

  private retriveNeeded: boolean = true;

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  public getEntityUrl = (): string => { return EntityUrl.CONFIGURATION_SHIPNODES; }

  public getBearerToken = (credential: IVCredent): string  => {
    // console.log(`credential to use: ${JSON.stringify(credential)}`);
    return credential == null ? null : credential.tokens.configurationShipNodes; 
  }

  // private data: ShipNode[];
  // private observable: Observable<ShipNode[]> = of(this.data);


  // private fackeShipnodes : ShipNode[] = [{    shipNode: 'junk_shipnode',
  //     latitude: 100,
  //     longitude: 100}];

  getShipnodeList(reloadShipnode=false) : BehaviorSubject<ShipNode[]> {

    if (reloadShipnode) {
      this.retriveNeeded = true;
      console.debug('User requested to reload shipnodes');
    }
    
    if (this.retriveNeeded) {
      this.retriveNeeded = false;
      console.debug('Requesting shipnodes from server. Current shipnodes: ', this.shipnodeSubject.value);
      this.retrieveAllShipnodes();
    }

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

  retrieveAllShipnodes(): void{
    this.getList<ShipNode>().subscribe(data => {
      console.debug('Received shipnodes from server.', data);
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
