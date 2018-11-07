import { Component } from '@angular/core';

import { CredentialComponent } from './credential/credential.component';
import { CredentialDataService } from './credential/credential-data.service';

import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'sterling-iv-poc';

  constructor (public dialog: MatDialog, private credentialDataService : CredentialDataService) {

  }

  doLogin() : void {
    
    let credentialCopy = Object.assign({}, this.credentialDataService.getCredential());
    // let tokenCopy = Object.assign({}, this.credentialDataService.getTokens());

    // let editingData = {credential: credentialCopy, tokens: tokenCopy};

    let dialogRef = this.dialog.open(CredentialComponent, {
      width: '600px',
      data: credentialCopy,
    });

    // dialogRef.componentInstance.event.subscribe((result) => {
    //   // this.dataService.addShipnode(result.data);
    //   // // this.dataService.getData();
    //   // this.dataSource = new ShipnodeDataSource(this.dataService);
    //   // this.changeDetectorRefs.detectChanges();
    // });
  }
}
