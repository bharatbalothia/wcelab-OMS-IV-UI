import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailabilityComponent } from './availability/availability.component';
import { LoginComponent } from './login/login.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SettingComponent } from './setting/setting.component';
import { SupplyComponent } from './supply/supply.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  // {path: 'shipnode', component: ShipnodeComponent},
  // {path: 'distgroup', component: DistgroupComponent},
  { path: 'login', component: LoginComponent },
  { path: 'supply', component: SupplyComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'availability', component: AvailabilityComponent },
  { path: 'setting', component: SettingComponent },
  { path: '**', component: WelcomeComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters { }