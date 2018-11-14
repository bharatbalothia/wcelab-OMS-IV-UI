import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CredentialComponent } from '../credential/credential.component'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router, private credentialComponent : CredentialComponent) {

  }

  ngOnInit() {
    console.log('router.url: ', this.router.url);
  }

}
