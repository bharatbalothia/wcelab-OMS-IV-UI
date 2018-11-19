import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { DistributionGroup, DistgroupDataService } from '../distgroup-data.service';
import { ShipNode, ShipnodeDataService } from '../../shipnode/shipnode-data.service';

@Component({
  selector: 'app-distgroup-editor',
  templateUrl: './distgroup-editor.component.html',
  styleUrls: ['./distgroup-editor.component.less']
})
export class DistgroupEditorComponent implements OnInit  {


  public event: EventEmitter<any> = new EventEmitter();

  public createNewDistgroup : boolean = false;

  public dgshipnodeToEdit : ShipNode;

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

  editShipnodeInDistgroup(shipnodeToEdit: ShipNode){
    this.dgshipnodeToEdit = shipnodeToEdit;
  }

  deleteShipNodeFromDg(dgshipnodeArray: ShipNode[], indexToRemove: number) {
    if (dgshipnodeArray != null && indexToRemove >= 0){
      dgshipnodeArray.splice(indexToRemove, 1);
    }
  }

  onAddClick(distgroupToEdit: DistributionGroup) {
    
    if (distgroupToEdit != null){
      if (distgroupToEdit.shipNodes == null) {
        distgroupToEdit.shipNodes = new Array<ShipNode>();
      }
      let newDgshipnode : ShipNode = {
        shipNode: null,
      };

      distgroupToEdit.shipNodes.push(newDgshipnode);
    }
  }

  getShipnodeList() : Observable<ShipNode[]> {

    return this.shipnodeDataService.getShipnodeList();
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
