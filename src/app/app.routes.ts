import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {ShipnodeComponent} from './shipnode/shipnode.component';
import {DistgroupComponent} from './distgroup/distgroup.component';
import {SupplyComponent} from './supply/supply.component';
import {SettingComponent} from './setting/setting.component';
import { LoginComponent } from './login/login.component';
import { AvailabilityComponent } from './availability/availability.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  // {path: 'shipnode', component: ShipnodeComponent},
  // {path: 'distgroup', component: DistgroupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'supply', component: SupplyComponent},
  {path: 'availability', component: AvailabilityComponent},
  {path: 'setting', component: SettingComponent},
  {path: '**', component: WelcomeComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {}