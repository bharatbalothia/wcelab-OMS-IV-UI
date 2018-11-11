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
    ]
  })

  export class MaterialModule {}