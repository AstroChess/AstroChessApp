import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { filter, take } from 'rxjs';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

import { ChessService } from '../chess.service';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  @Input() color!: 'w' | 'b';
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  chessInstance: Chess = new Chess();
  board!: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  possibleMoves: (string | undefined)[] = [];
  lastMoves: {from: string, to: string}[]= [];
  lastMove: {from: string, to: string} | undefined;

  constructor(private gameService: GameService, private chessService: ChessService) {}

  ngOnInit(): void {
    this.reloadBoard();
    this.gameService.whoseMove.pipe(filter(val=>val==='finished'), take(1)).subscribe(
      ()=>this.chessService.playAudio('notify')
    )
  }

  handlePositionChange(row: number, column: number, field: { square: Square; type: PieceSymbol; color: Color } | null) {
    if (this.gameService.whoseMove.value==='finished' || (field && this.color!==field.color)) {
      return;
    }

    if (!this.selectedColumn && !this.selectedRow && this.board[row][column]) {
      if(field?.color===this.gameService.whoseMove.value) {
        this.highlightPossibleMoves(field.square);
        this.setPositions(row, column);
      }
    } else if (this.selectedColumn !== null && this.selectedRow !== null && !(row===this.selectedRow && column===this.selectedColumn)) {
      if(field?.color===this.board[this.selectedRow][this.selectedColumn]?.color) {
        this.highlightPossibleMoves(field?.square!);
        this.setPositions(row, column);
      } else {
        this.changePositions(row, column);
      }
    } else {
      this.clearSelectedFields();
      this.clearPossibleMoves();
    }
    
    if (this.chessInstance.isGameOver()) {
      this.gameService.whoseMove.next('finished');
    }
  }

  getSquare(row: number, column: number) {
    return `${String.fromCharCode(97+column)}${8-row}`;
  }

  private setPositions(row: number, column: number) {
    this.selectedColumn = column;
    this.selectedRow = row;
  }

  private changePositions(row: number, column: number) {
    const fromField = this.getSquare(this.selectedRow!, this.selectedColumn!);
    const toField = this.getSquare(row, column);

    const move = this.chessInstance.move({
      from: fromField,
      to: toField,
    });

    this.lastMoves.push({from: fromField, to: toField}); 
    this.highlightLastMove(fromField, toField);

    this.chessInstance.load(move.after);
    this.reloadBoard();

    this.chessService.playAudio('move');

    console.log(move);
    this.onWhoseMoveChange();
    this.clearSelectedFields();
    this.clearPossibleMoves();
  }

  private reloadBoard() {
    this.board = this.color==='w' ? this.chessInstance.board() : this.chessInstance.board().reverse();
  }

  private clearSelectedFields() {
    this.selectedColumn = null;
    this.selectedRow = null;
  }

  private onWhoseMoveChange() {
    this.gameService.whoseMove.next(this.gameService.whoseMove.value==='w' ? 'b' : 'w');
  }

  private highlightPossibleMoves(square: Square) {
    this.possibleMoves = this.chessInstance.moves({square: square}).map(val=>val.match(/[a-z]{1}[1-8]{1}/)?.join(''));
    console.log(this.possibleMoves);
  }

  private highlightLastMove(from: string, to: string) {
    this.lastMove = {from, to};
  }

  private clearPossibleMoves() {
    this.possibleMoves = [];
  }
}
