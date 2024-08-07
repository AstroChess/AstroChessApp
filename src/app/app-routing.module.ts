import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProfileGuard } from './profile/profile.guard';
import { ProfileComponent } from './profile/profile.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileResolver } from './profile/profile.resolver';
import { AboutComponent } from './about/about.component';

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
        resolve: {
          profileData: ProfileResolver
        }, 
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
        path: 'about',
        component: AboutComponent,
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
