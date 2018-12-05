import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppRouters } from './app.routes';
import { AvaInquiryEditorComponent } from './availability/ava-inquiry-editor/ava-inquiry-editor.component';
import { AvaViewerComponent } from './availability/ava-viewer/ava-viewer.component';
import { AvailabilityComponent } from './availability/availability.component';
import { AutocompleteDropdownComponent } from './comp/autocomplete-dropdown/autocomplete-dropdown.component';
import { PhoneNumberFieldComponent, PhoneNumberInputComponent } from './comp/phonenumber/phone-number-input.component';
import { CredentialComponent } from './credential/credential.component';
import { DistgroupEditorComponent } from './distgroup/distgroup-editor/distgroup-editor.component';
import { DistgroupComponent } from './distgroup/distgroup.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { SettingComponent } from './setting/setting.component';
import { ShipnodeEditorComponent } from './shipnode/shipnode-editor/shipnode-editor.component';
import { ShipnodeComponent } from './shipnode/shipnode.component';
import { SupplyComponent } from './supply/supply.component';
import { ArrayListPipe } from './util/array-list.pipe';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReservationComponent } from './reservation/reservation.component';


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
    LoginComponent,
    AvaInquiryEditorComponent,
    AutocompleteDropdownComponent,
    PhoneNumberFieldComponent,
    PhoneNumberInputComponent,
    AvaViewerComponent,
    ReservationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRouters,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCssljS7J3SwyWobPQ87VUmafNtZK1Wop4' //Google API key for maps
    }),
    // import Angular Material modules
    MaterialModule,
    NgxJsonViewerModule,
    ChartsModule,
  ],
  
  providers: [  
  // {
  //   provide : HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptor,
  //   multi   : true,
  // },
    DatePipe,
    // Require the next two providers (MatDialogRef & MAT_DIALOG_DATA)
    // to inject CredentialComponent which has referece to dialog
    {
       provide: MatDialogRef,
       useValue: {
         close: (dialogResult: any) => { }
       }
    },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],

  entryComponents: [
    ShipnodeEditorComponent,
    CredentialComponent,
    DistgroupEditorComponent,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
