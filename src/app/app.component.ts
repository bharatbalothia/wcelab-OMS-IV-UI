import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor (private router: Router, 
    private credentialComponent: CredentialComponent, private credentialDataService : CredentialDataService) {

  }

  ngOnInit() {

    this.credentialDataService.loadCredentFromStore();

    const ivBaseUrl: string = this.credentialDataService.getIvBaseUrl();
    
    if (ivBaseUrl == null) {
      this.router.navigateByUrl('/login');
    }
  }

  doLogin(): void {
    this.credentialComponent.promptUserToLogin();
  }
}
