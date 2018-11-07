import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ShipNode, ShipnodeDataService} from '../shipnode-data.service';

@Component({
  selector: 'app-shipnode-editor',
  templateUrl: './shipnode-editor.component.html',
  styleUrls: ['./shipnode-editor.component.less']
})
export class ShipnodeEditorComponent {

  // private shipnodeToEdit : ShipNode = {
  //   shipNode: "",
  //   latitude: 0,
  //   longitude: 0,
  // };

  public event: EventEmitter<any> = new EventEmitter();

  public createNewShipnode : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ShipnodeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public shipnodeToEdit: ShipNode,
    public dataService: ShipnodeDataService
  ) {
    // console.log(`data for ShipnodeEditorComponent is: ${shipnodeToEdit}`);
    this.createNewShipnode = (shipnodeToEdit.shipNode == null);
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // this.shipnodeToEdit. = this.dataService.dataLength();
    this.event.emit({data: this.shipnodeToEdit});
    this.dialogRef.close();
  }
}
