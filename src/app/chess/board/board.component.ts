import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

import { BoardService } from './board.service';
import { Subscription } from '@supabase/supabase-js';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [BoardService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  @Input() color!: 'w' | 'b';
  columnSymbolArray: string[] = [];
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  board = new BehaviorSubject<({ square: Square; type: PieceSymbol; color: Color } | null)[][]>([[]]);
  possibleMoves: (string | undefined)[] = [];
  lastMove: { from: string; to: string } | undefined;
  promotionPiece: '' | 'q' | 'r' | 'n' | 'b' = '';
  promotionSquare: null | {row: number, column: number} = null;
  promotionChoose = false;
  subscriptions: Subscription[] = [];

  constructor(
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.columnSymbolArray = this.color==='w' ? ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : ['', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

    this.boardService.initialState();

    this.boardService.board.subscribe(
      (boardStructure: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]) => {
        console.log('cvhag')
        this.board.next(boardStructure);
      }
    )

    this.boardService.selectedRow.subscribe(row=>this.selectedRow=row);
    this.boardService.selectedColumn.subscribe(column=>this.selectedColumn=column);
    this.boardService.lastMove.subscribe(move=>this.lastMove=move);
    this.boardService.possibleMoves.subscribe(moves=>this.possibleMoves=moves);
    this.boardService.promotionPiece.subscribe(piece=>this.promotionPiece=piece);
    this.boardService.promotionSquare.subscribe(square=>this.promotionSquare=square);
    this.boardService.promotionChoose.subscribe(choose=>this.promotionChoose=choose);
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
}
