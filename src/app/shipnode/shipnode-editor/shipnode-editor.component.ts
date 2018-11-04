import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ShipnodeDataService} from '../shipnode-data.service';
import {ShipNode} from "../../datatype/ShipNode";

@Component({
  selector: 'app-shipnode-editor',
  templateUrl: './shipnode-editor.component.html',
  styleUrls: ['./shipnode-editor.component.less']
})
export class ShipnodeEditorComponent {

  private shipnodeEditing : ShipNode = {
    shipNode: "ShipNode Name",
    latitude: 0,
    longitude: 0,
  };

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ShipnodeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: ShipnodeDataService
  ) {
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
