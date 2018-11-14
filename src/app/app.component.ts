import { Component, OnInit } from '@angular/core';

import { CredentialComponent } from './credential/credential.component';
import { CredentialDataService } from './credential/credential-data.service';

import {MatDialog} from '@angular/material';

import {EntityUrl} from "./entity-url";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'sterling-iv-poc';

  constructor (private credentialDataService : CredentialDataService) {

  }

  ngOnInit() {

    this.credentialDataService.loadCredentFromStore();
    
  }

}
