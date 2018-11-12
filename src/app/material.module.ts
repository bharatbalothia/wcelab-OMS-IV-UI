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
    ]
  })

  export class MaterialModule {}