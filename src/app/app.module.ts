import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Imports to support Angular Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MaterialModule} from './material.module';
import {FormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import {AppRouters} from './app.routes';

import { ShipnodeComponent } from './shipnode/shipnode.component';
import { ShipnodeEditorComponent } from './shipnode/shipnode-editor/shipnode-editor.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { CredentialComponent } from './credential/credential.component';


// import { AuthInterceptor } from './auth.interceptor';

// import {DataService} from './data/data.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ShipnodeComponent,
    ShipnodeEditorComponent,
    CredentialComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import Angular Material modules
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AppRouters,
    HttpClientModule,
    FormsModule,
    
  ],
  
  providers: [  
  // {
  //   provide : HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptor,
  //   multi   : true,
  // },
  ],

  entryComponents: [
    ShipnodeEditorComponent,
    CredentialComponent,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
