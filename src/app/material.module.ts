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
    ]
  })

  export class MaterialModule {}