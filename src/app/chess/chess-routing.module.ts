import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChessComponent } from './chess.component';
import { GameComponent } from './game/game.component';
import { NewGameComponent } from './new-game/new-game.component';
import { GameResolver } from './game/game.resolver';

const routes: Routes = [
  {
    path: '',
    component: ChessComponent,
    children: [
      {
        path: '',
        component: NewGameComponent,
        pathMatch: 'full',
      },
      {
        path: ':id',
        component: GameComponent,
        resolve: {
          gameData: GameResolver
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChessRoutingModule {}
