import { Component, OnInit, Inject,ChangeDetectorRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Credent, CredentialDataService} from "./credential-data.service";


@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.less']
})
export class CredentialComponent implements OnInit {

  private credentialDirty = false;

  constructor(
    public dialogRef: MatDialogRef<CredentialComponent>,
    @Inject(MAT_DIALOG_DATA) public cloneOfCredAndTokens: any,
    public dataService: CredentialDataService, 
    private changeDetectorRefs: ChangeDetectorRef) { }

  // public event: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  setCredentialDirty(): void {

    this.credentialDirty = true;
    console.log('setting credentialDirty flag to true');

  }

  onCancelClick(): void {
    this.credentialDirty = false;
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // this.shipnodeEditing. = this.dataService.dataLength();
    // this.event.emit({data: this.cloneOfCredAndTokens});

    if (this.credentialDirty) {
      // Save the credential to the data service
      Object.assign(this.dataService.getCredential(), this.cloneOfCredAndTokens.credential);

      this.reloadTokens();
    }

    this.credentialDirty = false;
    this.dialogRef.close();
  }

  private reloadTokens():void {
    this.dataService.getNetWorkAvailabilityToken(this.cloneOfCredAndTokens.credential).subscribe(
      data => {console.log(data.access_token); this.cloneOfCredAndTokens.tokens.availabilityNetwork = data.access_token}
    );


    this.changeDetectorRefs.detectChanges();
  }



}
