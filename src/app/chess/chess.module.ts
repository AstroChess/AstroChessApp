import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessComponent } from './chess.component';
import { ChessRoutingModule } from './chess-routing.module';
import { TimerComponent } from './timer/timer.component';
import { NbCardModule, NbLayoutModule, NbListModule } from '@nebular/theme';



@NgModule({
  declarations: [
    ChessComponent,
    TimerComponent
  ],
  imports: [
    CommonModule,
    ChessRoutingModule,
    NbCardModule,
    NbLayoutModule,
    NbListModule
  ]
})
export class ChessModule { }
