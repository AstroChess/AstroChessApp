import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  board = [
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ];

  constructor() {}

  ngOnInit(): void {}

  handlePositionChange(row: number, column:number) {
    if(!this.selectedColumn && !this.selectedRow && this.board[row][column]) {
      this.setPositions(row, column);
    } else if(this.selectedColumn && this.selectedRow) {
      this.changePositions(row, column);
    } else {
      this.clearSelectedFields();
    }
  }

  private setPositions(row: number, column:number) {
    this.selectedColumn = column;
    this.selectedRow = row;
  }

  private changePositions(row: number, column:number) {
    this.board[row][column] = this.board[this.selectedRow!].splice(this.selectedColumn!, 1, this.board[row][column])[0];
    this.clearSelectedFields();
  }

  private clearSelectedFields() {
    this.selectedColumn = null;
    this.selectedRow = null;
  }
}
