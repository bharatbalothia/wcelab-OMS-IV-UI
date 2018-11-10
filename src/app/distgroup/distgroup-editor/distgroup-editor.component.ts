import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DistributionGroup, DistgroupDataService, DGShipNode } from '../distgroup-data.service';
import { ShipNode, ShipnodeDataService } from '../../shipnode/shipnode-data.service';

@Component({
  selector: 'app-distgroup-editor',
  templateUrl: './distgroup-editor.component.html',
  styleUrls: ['./distgroup-editor.component.less']
})
export class DistgroupEditorComponent implements OnInit  {


  public event: EventEmitter<any> = new EventEmitter();

  public createNewDistgroup : boolean = false;

  public dgshipnodeToEdit : DGShipNode;

  constructor(
    public dialogRef: MatDialogRef<DistgroupEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public distgroupToEdit: DistributionGroup,
    public dataService: DistgroupDataService,
    public shipnodeDataService: ShipnodeDataService,
  ) {
    // console.log(`data for ShipnodeEditorComponent is: ${distgroupToEdit}`);
    this.createNewDistgroup = (distgroupToEdit.distributionGroupId == null);
    
  }

  ngOnInit = ():void => {

  }

  editShipnodeInDistgroup(shipnodeToEdit: DGShipNode){
    this.dgshipnodeToEdit = shipnodeToEdit;
  }

  deleteShipNodeFromDg(dgshipnodeArray: DGShipNode[], indexToRemove: number) {
    if (dgshipnodeArray != null && indexToRemove >= 0){
      dgshipnodeArray.splice(indexToRemove, 1);
    }
  }

  onAddClick(distgroupToEdit: DistributionGroup) {
    
    if (distgroupToEdit != null){
      if (distgroupToEdit.shipNodes == null) {
        distgroupToEdit.shipNodes = new Array<DGShipNode>();
      }
      let newDgshipnode : DGShipNode = {
        shipNode: null,
      };

      distgroupToEdit.shipNodes.push(newDgshipnode);
    }
  }

  getShipnodeList() : ShipNode[] {



    let shipnodeList : ShipNode[] = this.shipnodeDataService.getShipnodeList().value;

    // console.log(`getShipnodeList: ${JSON.stringify(shipnodeList)}`);
    return shipnodeList;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // this.distgroupToEdit. = this.dataService.dataLength();
    this.event.emit({data: this.distgroupToEdit});
    this.dialogRef.close();
  }

  trackByMyIndex(index: number, obj: any): any {
    return index;
  }
}
