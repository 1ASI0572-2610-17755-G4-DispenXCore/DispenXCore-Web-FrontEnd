import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { SignInComponent } from './public/pages/signin.component/signin.component';
import { SignUpComponent } from './public/pages/signup.component/signup.component';
import { authenticationGuard } from './user-access/services/authentication.guard';
import { DashboardComponent } from './shared/pages/dashboard/dashboard.component';
import {ScheduleComponent} from "./inventory-telemetry/pages/schedule/schedule.component";
import {HistoryComponent} from "./inventory-telemetry/pages/history/history.component";
import {SettingsComponent} from "./shared/pages/settings/settings.component";
import {SupportComponent} from "./shared/pages/support/support.component";
import {NotFoundComponent} from "./shared/pages/not-found/not-found.component";
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authenticationGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'support', component: SupportComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'sign-in' },
];
