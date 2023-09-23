import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Subscription } from '@supabase/supabase-js';
import { Square, PieceSymbol, Color } from 'chess.js';

import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [BoardService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, OnDestroy {
  @Input() color!: 'w' | 'b';
  columnSymbolArray: string[] = [];
  selected: {row: number, column: number} | null = null;
  board = new BehaviorSubject<({ square: Square; type: PieceSymbol; color: Color } | null)[][]>([[]]);
  possibleMoves: (string | undefined)[] = [];
  lastMove: { from: string; to: string } | undefined;
  promotion: {
    piece: '' | 'q' | 'r' | 'n' | 'b', 
    square: null | {row: number, column: number}, 
    choose: boolean 
  } = { piece: '', square: null, choose: false };
  subscriptions!: any[];

  constructor(
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.columnSymbolArray = this.color==='w' ? ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : ['', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

    this.boardService.initialState();
    
    this.subscriptions = [
      this.boardService.board.subscribe(
        (boardStructure: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]) => {
          this.board.next(boardStructure);
        }
      ),

      this.boardService.selected.subscribe(
        (square: { row: number; column: number; } | null) => this.selected=square
      ),

      this.boardService.lastMove.subscribe(
        (move: {from: string, to: string} | undefined) => this.lastMove=move
      ),

      this.boardService.possibleMoves.subscribe(
        (moves: (string | never)[]) => this.possibleMoves=moves
      ),
      
      this.boardService.promotion.subscribe(
        (promotionData: {piece: "" | "n" | "b" | "r" | "q", square: {row: number, column: number} | null, choose: boolean;}) => this.promotion=promotionData
      ),
    ]
  }

  async handlePositionChange(
    row: number,
    column: number,
    field: { square: Square; type: PieceSymbol; color: Color } | null,
    mode: 'player' | 'opponent'
  ) {
    this.boardService.handlePositionChange(row, column, field, mode);
  }

  getSquare(row: number, column: number) {
    if (this.color === 'w') {
      return `${String.fromCharCode(97 + column)}${8 - row}`;
    }
    return `${String.fromCharCode(97 + 7 - column)}${row + 1}`;
  }

  handlePiecePromotion(
    piece: 'q' | 'r' | 'n' | 'b',
    event: any,
    field: { square: Square; type: PieceSymbol; color: Color } | null) {
      event.stopPropagation();
      this.boardService.handlePiecePromotion(piece, field);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription=>{
      subscription.unsubscribe();
    })
  }
}
