import { Component, OnInit, Inject,ChangeDetectorRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IVCredent, CredentialDataService} from "./credential-data.service";
// import { Observable, forkJoin  } from 'rxjs';
// import { EntityUrl } from '../entity-url'


@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.less']
})
export class CredentialComponent implements OnInit {

  private credentialDirty = false;

  constructor(
    public dialogRef: MatDialogRef<CredentialComponent>,
    @Inject(MAT_DIALOG_DATA) public cloneOfCredential: IVCredent,
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

    // Save the credential to the data service
    Object.assign(this.dataService.getCredential(), this.cloneOfCredential);

    // If user actually changed the credentials
    //   instead of update tokens or didn't change anything
    if (this.credentialDirty) {
      this.renewAllTokens();
    }

    this.credentialDirty = false;

    // localStorage.setItem(EntityUrl.STORE_KEY_TOKENS, JSON.stringify(this.cloneOfCredential.tokens));

    this.dialogRef.close();
  }
  

  renewAllTokens(): void {

    this.dataService.reloadTokens();

    this.changeDetectorRefs.detectChanges();
  }



}
