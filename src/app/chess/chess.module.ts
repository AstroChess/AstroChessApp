import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessComponent } from './chess.component';
import { ChessRoutingModule } from './chess-routing.module';



@NgModule({
  declarations: [
    ChessComponent
  ],
  imports: [
    CommonModule,
    ChessRoutingModule
  ]
})
export class ChessModule { }
