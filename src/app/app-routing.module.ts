import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuard } from './profile/profile.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '', component: ProfileComponent, pathMatch: 'full'
  },
  {
    path: 'auth', loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
