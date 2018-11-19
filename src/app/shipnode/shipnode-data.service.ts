import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { CredentialDataService, IVCredent } from "../credential/credential-data.service";
import { EntityUrl } from "../entity-url";
import { HttpErrorHandler } from '../http-error-handler.service';
import { IvServiceBase } from "../iv-service-base.service";
import { ArrayUtil } from '../util/array-util';



export interface ShipNode {
  shipNode: string;
  latitude?: number;
  longitude?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShipnodeDataService extends IvServiceBase {

  // @Output() shipnodeListChanged = new EventEmitter<ShipNode[]>();

  private shipnodeSubject: AsyncSubject<ShipNode[]> = new AsyncSubject<ShipNode[]>();

  // private shipnodeList: ShipNode[];

  private retriveNeeded: boolean = true;

  constructor( http: HttpClient, httpErrorHandler: HttpErrorHandler, credentialData: CredentialDataService) {
    super(http, httpErrorHandler, credentialData);
  }

  protected getEntityUrl = (): string => { return EntityUrl.CONFIGURATION_SHIPNODES; }

  protected getBearerToken = (credential: IVCredent): string  => {
    return credential == null ? null : credential.tokens.configurationShipNodes; 
  }

  getShipnodeList(reloadShipnode=false) : Observable<ShipNode[]> {

    if (reloadShipnode) {
      this.retriveNeeded = true;
      console.debug('User requested to reload shipnodes');
    }
    
    if (this.retriveNeeded) {
      this.retriveNeeded = false;
      console.debug('Requesting shipnodes from server.');
      this.retrieveAllShipnodes();
    }

    return this.shipnodeSubject;
  }

  private retrieveAllShipnodes(): void{
    this.getList<ShipNode>().subscribe(data => {
      console.debug('Received shipnodes from server.', data);
      this.sendToSubscribers(data);
    });
  }

  /**
   * Add a new shipnode. This function adds the shipnode
   * to the sever then send new shipnode list to all subscribers
   * of getShipnodeList()
   * @param newShipnode New shipnode to add
   */
  addShipnode(newShipnode: ShipNode): void {

    console.info (`creating shipndoe: ${JSON.stringify(newShipnode)}`);
    
    this.putObject<ShipNode>(newShipnode, '/' + encodeURIComponent(newShipnode.shipNode)).subscribe(
      result => {
        console.debug('Put shipnode into IV finished. ==== http result: ' , result);
      }
    );
  }

  /**
   * This function only updates to the server but does not update the class 
   * local cache of the ShipnodeList array. After updating the server,
   * the function sends updated ShipnodeList to all subscribers of
   * getShipnodeList()
   * @param updatedShipnode Shipnode to update. The function assumes 
   * that the updatedShipnode is an element of ShipnodeList array.
   */
  updateShipnode(updatedShipnode: ShipNode){
    console.info (`updating shipndoe: ${JSON.stringify(updatedShipnode)}`);
    
    this.putObject<ShipNode>(updatedShipnode, '/' + encodeURIComponent(updatedShipnode.shipNode)).subscribe(
      result => {
        console.debug('updated %s into IV finished. ==== http result: ', JSON.stringify(updatedShipnode) , result);
      }
    );
    
  }

  deleteShipnode(shipnodeToDelete: ShipNode): void {

    console.info (`deleteing shipndoe: ${JSON.stringify(shipnodeToDelete)}`);
    
    this.deleteObject('/' + encodeURIComponent(shipnodeToDelete.shipNode))
    .subscribe(
      result => {
        console.debug('deleted %s from IV finished. ==== http result: ', JSON.stringify(shipnodeToDelete) , result);
      }
    );

  }


  private sendToSubscribers(shipnodeList: ShipNode[]) {
    this.shipnodeSubject.next(shipnodeList);
    this.shipnodeSubject.complete();
  }

}
