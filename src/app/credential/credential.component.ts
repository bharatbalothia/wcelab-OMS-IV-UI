import { Component, OnInit, Inject,ChangeDetectorRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IVCredent, CredentialDataService} from "./credential-data.service";


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
      this.reloadTokens();
    }

    this.credentialDirty = false;

    this.dialogRef.close();
  }

  renewAllTokens(): void {
    this.reloadTokens();
  }

  private reloadTokens():void {

    this.dataService.requestNetWorkAvailabilityToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.availabilityNetwork = data.access_token}
    );

    this.dataService.requestDistributionGroupsToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.configurationDistributionGroups = data.access_token}
    );

    this.dataService.requestSettingsToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.configurationSettings = data.access_token}
    );

    this.dataService.requestShipnodesToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.configurationShipNodes = data.access_token}
    );

    this.dataService.requestThresholdsToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.configurationThresholds = data.access_token}
    );

    this.dataService.requestDemandsToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.demands = data.access_token}
    );

    this.dataService.requestReservationsToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.reservations = data.access_token}
    );

    this.dataService.requestSuppliesToken(this.cloneOfCredential).subscribe(
      data => {this.cloneOfCredential.tokens.supplies = data.access_token}
    );

    this.changeDetectorRefs.detectChanges();
  }



}
