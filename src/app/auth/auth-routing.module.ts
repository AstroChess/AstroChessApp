import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './forms/login/login.component';
import { RegisterComponent } from './forms/register/register.component';
import { PasswordResetComponent } from './forms/password-reset/password-reset.component';
import { NbAuthComponent } from '@nebular/auth';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reset-password',
        component: PasswordResetComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
