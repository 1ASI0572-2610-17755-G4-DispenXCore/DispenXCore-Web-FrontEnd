import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { SignInComponent } from './public/pages/signin.component/signin.component';
import { SignUpComponent } from './public/pages/signup.component/signup.component';
import { authenticationGuard } from './user-access/services/authentication.guard';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authenticationGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'schedule', component: NotFoundComponent },
      { path: 'history', component: NotFoundComponent },
      { path: 'settings', component: NotFoundComponent },
      { path: 'support', component: NotFoundComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', redirectTo: 'sign-in' },
];
