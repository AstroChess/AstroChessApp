import { Component, OnInit } from '@angular/core';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  chessInstance: Chess = new Chess();
  board!: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  whoseMove: 'w' | 'b' = 'w';

  constructor() {}

  ngOnInit(): void {
    this.board = this.chessInstance.board();
  }

  handlePositionChange(row: number, column: number, field: { square: Square; type: PieceSymbol; color: Color } | null) {
    if (!this.selectedColumn && !this.selectedRow && this.board[row][column]) {
      if(field?.color===this.whoseMove) {
        this.setPositions(row, column);
      }
    } else if (this.selectedColumn !== null && this.selectedRow !== null) {
      this.changePositions(row, column);
    } else {
      this.clearSelectedFields();
    }
  }

  private setPositions(row: number, column: number) {
    this.selectedColumn = column;
    this.selectedRow = row;
  }

  private changePositions(row: number, column: number) {
    const move = this.chessInstance.move({
      from: `${String.fromCharCode(97+this.selectedColumn!)}${8-this.selectedRow!}`,
      to: `${String.fromCharCode(97+column)}${8-row}`,
    });

    this.chessInstance.load(move.after);
    this.reloadBoard()

    console.log(move);
    this.onWhoseMoveChange();
    this.clearSelectedFields();
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
}
