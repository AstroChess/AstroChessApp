import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChessComponent } from './chess.component';
import { GameComponent } from './game/game.component';
import { NewGameComponent } from './new-game/new-game.component';

const routes: Routes = [
  {
    path: '',
    component: ChessComponent,
    children: [
      {
        path: '', component: NewGameComponent, pathMatch: 'full' 
      },
      {
        path: ':id', component: GameComponent 
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChessRoutingModule {}
