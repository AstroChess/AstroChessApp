import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './forms/login/login.component';
import { RegisterComponent } from './forms/register/register.component';
import { PasswordResetComponent } from './forms/password-reset/password-reset.component';

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
          component: PasswordResetComponent,
        }]

    
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

