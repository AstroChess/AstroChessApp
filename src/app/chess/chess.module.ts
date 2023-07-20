import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimerPipe } from './timer/timer.pipe';
import { ChessComponent } from './chess.component';
import { GameComponent } from './game/game.component';
import { SharedModule } from '../shared/shared.module';
import { TimerComponent } from './timer/timer.component';
import { BoardComponent } from './board/board.component';
import { ChessRoutingModule } from './chess-routing.module';
import { NewGameComponent } from './new-game/new-game.component';

@NgModule({
  declarations: [
    ChessComponent,
    TimerComponent,
    BoardComponent,
    TimerPipe,
    GameComponent,
    NewGameComponent,
  ],
  imports: [
    CommonModule,
    ChessRoutingModule,
    SharedModule,
  ]
})
export class ChessModule {}
