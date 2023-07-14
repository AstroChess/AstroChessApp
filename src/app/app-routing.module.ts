import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProfileGuard } from './profile/profile.guard';
import { ProfileComponent } from './profile/profile.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
      {
        path: 'home',
        component: HomepageComponent,
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ProfileGuard],
      },
      {
        path: 'game',
        loadChildren: () =>
          import('./chess/chess.module').then((m) => m.ChessModule),
        canActivate: [ProfileGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
