import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  NbLoginComponent,
  NbRegisterComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './forms/login/login.component';
import { RegisterComponent } from './forms/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
        {
          path: '',
          component: LoginComponent,
        },
        {
          path: 'login',
          component: LoginComponent,
        },
        {
          path: 'register',
          component: RegisterComponent,
        },
        {
          path: 'reset-password',
          component: NbResetPasswordComponent,
        }]

    
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

