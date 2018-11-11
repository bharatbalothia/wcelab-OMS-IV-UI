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
    ]
  })

  export class MaterialModule {}