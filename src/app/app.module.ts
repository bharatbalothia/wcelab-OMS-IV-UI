import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Imports to support Angular Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import {AppRouters} from './app.routes';

import { ShipnodeComponent } from './shipnode/shipnode.component';
import { ShipnodeEditorComponent } from './shipnode/shipnode-editor/shipnode-editor.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { CredentialComponent } from './credential/credential.component';
import { DistgroupComponent } from './distgroup/distgroup.component';
import { DistgroupEditorComponent } from './distgroup/distgroup-editor/distgroup-editor.component';
import { ArrayListPipe } from './util/array-list.pipe';
import { SupplyComponent } from './supply/supply.component';

import { DatePipe } from '@angular/common';
import { SettingComponent } from './setting/setting.component';
import { AvailabilityComponent } from './availability/availability.component';



// import { AuthInterceptor } from './auth.interceptor';

// import {DataService} from './data/data.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ShipnodeComponent,
    ShipnodeEditorComponent,
    CredentialComponent,
    DistgroupComponent,
    DistgroupEditorComponent,
    ArrayListPipe,
    SupplyComponent,
    SettingComponent,
    AvailabilityComponent,
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
    ReactiveFormsModule,
  ],
  
  providers: [  
  // {
  //   provide : HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptor,
  //   multi   : true,
  // },
    DatePipe,
  ],

  entryComponents: [
    ShipnodeEditorComponent,
    CredentialComponent,
    DistgroupEditorComponent,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
