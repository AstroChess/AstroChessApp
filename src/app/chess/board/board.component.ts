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

  constructor() {}

  ngOnInit(): void {
    this.board = this.chessInstance.board();
  }

  handlePositionChange(row: number, column: number) {
    if (!this.selectedColumn && !this.selectedRow && this.board[row][column]) {
      this.setPositions(row, column);
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
    this.board[row][column] = this.board[this.selectedRow!].splice(
      this.selectedColumn!,
      1,
      this.board[row][column]
    )[0];
    this.clearSelectedFields();
  }

  private clearSelectedFields() {
    this.selectedColumn = null;
    this.selectedRow = null;
  }
}
