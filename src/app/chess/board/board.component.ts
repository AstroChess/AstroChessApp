import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import { filter, take } from 'rxjs';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

import { ChessService } from '../chess.service';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() color!: 'w' | 'b';
  @Input() timeToEnd!: number;
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  chessInstance: Chess = new Chess();
  board!: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  possibleMoves: (string | undefined)[] = [];
  lastMoves: { from: string; to: string }[] = [];
  lastMove: { from: string; to: string } | undefined;

  constructor(
    private gameService: GameService,
    private chessService: ChessService
  ) {}

  ngOnInit(): void {
    this.reloadBoard();
    this.gameService.whoseMove
      .pipe(
        filter((val) => val === 'finished'),
        take(1)
      )
      .subscribe(() => this.chessService.playAudio('notify'));
    this.chessService.supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'moves',
          filter: `game_id=eq.${this.gameService.gameData.game_id}`,
        },
        (payload) => {
          if(payload.new['color']!==(this.color==='w' ? 'white' : 'black')){
            this.changePositions(0, 0, payload.new['from'], payload.new['to'])
            console.log('response', payload);
          }
        }
      )
      .subscribe();
  }

  handlePositionChange(
    row: number,
    column: number,
    field: { square: Square; type: PieceSymbol; color: Color } | null,
    mode: 'player' | 'opponent'
  ) {
    const whoseMove = this.gameService.whoseMove.value;
    if (
      whoseMove === 'finished' ||
      (field && this.color !== field.color) ||
      (whoseMove !== this.color && mode === 'player')
    ) {
      return;
    }

    if (!this.selectedColumn && !this.selectedRow && this.board[row][column]) {
      if (field?.color === this.gameService.whoseMove.value) {
        this.highlightPossibleMoves(field.square);
        this.setPositions(row, column);
      }
    } else if (
      this.selectedColumn !== null &&
      this.selectedRow !== null &&
      !(row === this.selectedRow && column === this.selectedColumn)
    ) {
      if (
        field?.color ===
        this.board[this.selectedRow][this.selectedColumn]?.color
      ) {
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
    return `${String.fromCharCode(97 + column)}${8 - row}`;
  }

  getRowAndColumn(square: string) {
    const row = +square[1]+8;
    const column = square.charCodeAt(0)-97;
    return {column, row};
  }

  private setPositions(row: number, column: number) {
    this.selectedColumn = column;
    this.selectedRow = row;
  }

  private async changePositions(row: number, column: number, fromSquare?: string, toSquare?: string) {
    let fromField, toField;
    if(fromSquare && toSquare) {
      fromField = fromSquare;
      toField = toSquare;
    } else {
      fromField = this.getSquare(this.selectedRow!, this.selectedColumn!);
      toField = this.getSquare(row, column);
    }

    console.log(fromField, toField, 'tofield');

    const move = this.chessInstance.move({
      from: fromField,
      to: toField,
    });

    this.lastMoves.push({ from: fromField, to: toField });
    this.highlightLastMove(fromField, toField);

    this.chessInstance.load(move.after);
    this.reloadBoard();

    this.chessService.playAudio('move');

    const data = {
      game_id: this.gameService.gameData.game_id,
      user_id: this.gameService.player.userid,
      color: this.color === 'w' ? 'white' : 'black',
      from: move.from,
      to: move.to,
      FEN_after: move.after,
      remaining_time_ms: this.gameService.timeToEnd,
    };
    console.log(data);
    this.clearSelectedFields();
    this.clearPossibleMoves();
    if(this.gameService.whoseMove.value===this.color) {
      await this.chessService.supabase.from('moves').insert(data);
    }
    this.onWhoseMoveChange();
  }

  private reloadBoard() {
    if(this.color==='w') {
      this.board = this.chessInstance.board()
    } else {
      this.board = this.chessInstance.board().reverse();
      this.board.map(subarray=>subarray.reverse());
    }
    
    console.log('abaa')
  }

  private clearSelectedFields() {
    this.selectedColumn = null;
    this.selectedRow = null;
  }

  private onWhoseMoveChange() {
    this.gameService.whoseMove.next(
      this.gameService.whoseMove.value === 'w' ? 'b' : 'w'
    );
  }

  private highlightPossibleMoves(square: Square) {
    this.possibleMoves = this.chessInstance
      .moves({ square: square })
      .map((val) => val.match(/[a-z]{1}[1-8]{1}/)?.join(''));
  }

  private highlightLastMove(from: string, to: string) {
    this.lastMove = { from, to };
  }

  private clearPossibleMoves() {
    this.possibleMoves = [];
  }
}
