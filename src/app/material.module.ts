import {NgModule} from '@angular/core';


import {
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatRadioModule,
  } from '@angular/material';
  
  @NgModule({
    imports: [
      MatSidenavModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      MatCardModule,
      MatButtonModule,
      MatTableModule,
      MatDialogModule,
      MatInputModule,
      MatSelectModule,
      MatTabsModule,
      MatExpansionModule,
      MatAutocompleteModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonToggleModule,
      MatRadioModule,
    ],
    exports: [
      MatSidenavModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      MatCardModule,
      MatButtonModule,
      MatTableModule,
      MatDialogModule,
      MatInputModule,
      MatSelectModule,
      MatTabsModule,
      MatExpansionModule,
      MatAutocompleteModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonToggleModule,
      MatRadioModule,
    ]
  })

  export class MaterialModule {}