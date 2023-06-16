import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileGuard } from './profile/profile.guard';

const routes: Routes = [
  {
    path: '', component: AppComponent, pathMatch: 'full'
  },
  {
    path: 'auth', loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
