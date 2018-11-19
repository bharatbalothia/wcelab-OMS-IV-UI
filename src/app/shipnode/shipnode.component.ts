import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/table';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShipNode, ShipnodeDataService } from './shipnode-data.service';
import { ShipnodeEditorComponent } from './shipnode-editor/shipnode-editor.component';
import { ArrayUtil } from '../util/array-util';




@Component({
  selector: 'app-shipnode',
  templateUrl: './shipnode.component.html',
  styleUrls: ['./shipnode.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'hidden' })),
      state('expanded', style({ height: "*", minHeight: '56px', width: '100%' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ShipnodeComponent implements OnInit{

  displayedColumns = ['shipNode', 'latitude', 'longitude', 'delete'];

  matTableDataSource: MatTableDataSource;

  
  private shipnodeListSubject: BehaviorSubject<ShipNode[]>;
  private shipnodeList: ShipNode[];

  constructor(public dialog: MatDialog,
    private dataService: ShipnodeDataService, private changeDetectorRefs: ChangeDetectorRef) {
      
      this.shipnodeList = null;
      
      this.shipnodeListSubject = new BehaviorSubject<ShipNode[]>(null);

      this.matTableDataSource = new MatTableDataSource(this.shipnodeListSubject);
  }

  ngOnInit() {

    this.dataService.getShipnodeList().subscribe( (data: ShipNode[]) => {
      this.shipnodeList = data;

      this.publishShipnodeList();
    })

  }

  deleteShipnode(shipNode: ShipNode): void {

    this.dataService.deleteShipnode(shipNode);
    
    ArrayUtil.findAndRemoveFromArray<ShipNode>(this.shipnodeList,
      node => node.shipNode == shipNode.shipNode);
    
    this.publishShipnodeList();
  }

  editShipnode(shipnodeToEdit: ShipNode): void {

    console.debug('Editing Shipnode.', shipnodeToEdit);

    this.openShipnodeDetailDialog(shipnodeToEdit);
  }

  private openShipnodeDetailDialog(shipnodeToEdit?: ShipNode): void {

    let createNewShipNode = false;

    if (shipnodeToEdit == null) {
      shipnodeToEdit = {
        shipNode: null,
        latitude: null,
        longitude: null,
      };
      createNewShipNode = true;
    }

    let dialogRef = this.dialog.open(ShipnodeEditorComponent, {
      width: '600px',
      data: shipnodeToEdit
    });

    dialogRef.componentInstance.submitEvent.subscribe((shipnodeEdited: ShipNode) => {

      let shipNodeEdited = shipnodeEdited;

      if (createNewShipNode) {
        // This is a new shipnode. Add it
        this.dataService.addShipnode(shipNodeEdited);
        this.shipnodeList.push(shipnodeEdited);
      } else {
        // This is an existing shipnode. Update it
        this.dataService.updateShipnode(shipNodeEdited);
      }
      
      this.publishShipnodeList();
    });
  }

  /**
   * Let shipnodeListSubject subscribers
   * know that the shipnode list has changed.
   */
  private publishShipnodeList() {
    this.shipnodeListSubject.next(this.shipnodeList);
  }


  // ***********************************************************
  // ** Logic for expanding detail row
  // ***********************************************************
  expandedElement: ShipNode;

  onRowClick(shipNodeClicked: ShipNode) {

    this.expandedElement = (shipNodeClicked !== this.expandedElement) ?
      shipNodeClicked : null;
  }

}

/**
 * Simple class to provide datasource for the Shipnode Mat-table
 */
class MatTableDataSource extends DataSource<ShipNode> {

  /**
   * 
   * @param shipnodeListObservable The shipnode array that Mat-Table should observe.
   */
  constructor(private shipnodeListObservable: Observable<ShipNode[]>) {
    
    super();
  }


  connect(): Observable<ShipNode[]> {
    return this.shipnodeListObservable;
  }

  disconnect() {
  }
}