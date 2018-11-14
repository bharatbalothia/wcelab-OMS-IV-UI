import { Component, OnInit, Inject, Injectable, ChangeDetectorRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IVCredent, CredentialDataService} from "./credential-data.service";
// import { Observable, forkJoin  } from 'rxjs';
// import { EntityUrl } from '../entity-url'


@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.less']
})
@Injectable({
  providedIn: 'root'
})
export class CredentialComponent implements OnInit {

  private credentialDirty = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CredentialComponent>,
    @Inject(MAT_DIALOG_DATA) public cloneOfCredential: IVCredent,
    public dataService: CredentialDataService, 
    private changeDetectorRefs: ChangeDetectorRef) { }

  // public event: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

  }


  setCredentialDirty(): void {

    this.credentialDirty = true;
    console.debug('setting credentialDirty flag to true');

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

    console.warn('Renewing all API tokens');

    this.dataService.reloadTokens();

    this.changeDetectorRefs.detectChanges();
    
  }

  promptUserToLogin(dialogWidth = '600px') : void {
    
    let credentialCopy = Object.assign({}, this.dataService.getCredential());
    
    this.dialog.open(CredentialComponent, {
      width: dialogWidth,
      data: credentialCopy,
    });

  }


}
