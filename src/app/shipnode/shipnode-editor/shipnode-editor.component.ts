import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ShipNode, ShipnodeDataService} from '../shipnode-data.service';

@Component({
  selector: 'app-shipnode-editor',
  templateUrl: './shipnode-editor.component.html',
  styleUrls: ['./shipnode-editor.component.less']
})
export class ShipnodeEditorComponent {

  // private shipnodeEditing : ShipNode = {
  //   shipNode: "",
  //   latitude: 0,
  //   longitude: 0,
  // };

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ShipnodeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public shipnodeEditing: ShipNode,
    public dataService: ShipnodeDataService
  ) {
    console.log(`data for ShipnodeEditorComponent is: ${shipnodeEditing}`);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // this.shipnodeEditing. = this.dataService.dataLength();
    this.event.emit({data: this.shipnodeEditing});
    this.dialogRef.close();
  }
}
