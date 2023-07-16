import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  chessInstance: Chess = new Chess();
  board!: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  whoseMove: 'w' | 'b' = 'w';
  possibleMoves: (string | undefined)[] = [];
  lastMoves: {from: string, to: string}[]= [];
  
  get lastMove(): {from: string, to: string} | undefined {
    return this.lastMoves[this.lastMoves.length-1];
  }

  constructor() {}

  ngOnInit(): void {
    this.board = this.chessInstance.board();
  }

  handlePositionChange(row: number, column: number, field: { square: Square; type: PieceSymbol; color: Color } | null) {
    if (!this.selectedColumn && !this.selectedRow && this.board[row][column]) {
      if(field?.color===this.whoseMove) {
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

    this.chessInstance.load(move.after);
    this.reloadBoard();

    this.playAudio('move')

    console.log(move);
    this.onWhoseMoveChange();
    this.clearSelectedFields();
    this.clearPossibleMoves();
  }

  private reloadBoard() {
    this.board = this.chessInstance.board();
  }

  private clearSelectedFields() {
    this.selectedColumn = null;
    this.selectedRow = null;
  }

  private onWhoseMoveChange() {
    this.whoseMove = this.whoseMove==='w' ? 'b' : 'w';
  }

  private highlightPossibleMoves(square: Square) {
    this.possibleMoves = this.chessInstance.moves({square: square}).map(val=>val.match(/[a-z]{1}[1-8]{1}/)?.join(''));
    console.log(this.possibleMoves)
  }

  private clearPossibleMoves() {
    this.possibleMoves = [];
  }

  private playAudio(type: 'check' | 'move') {
    const audio = new Audio();
    audio.src = `/assets/sound/${type}.mp3`
    audio.load();
    audio.play();
  }
}
