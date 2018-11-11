import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {ShipnodeComponent} from './shipnode/shipnode.component';
import {DistgroupComponent} from './distgroup/distgroup.component';
import {SupplyComponent} from './supply/supply.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'shipnode', component: ShipnodeComponent},
  {path: 'distgroup', component: DistgroupComponent},
  {path: 'supply', component: SupplyComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {}