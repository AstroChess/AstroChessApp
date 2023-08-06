import { Component, OnInit, Input } from '@angular/core';

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
    this.loadOnReload();
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
          if (
            payload.new['color'] !== (this.color === 'w' ? 'white' : 'black')
          ) {
            this.changePositions(0, 0, payload.new['from'], payload.new['to']);
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
      (field &&
        !this.selectedColumn &&
        !this.selectedRow &&
        this.color !== field.color) ||
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
    if (this.color === 'w') {
      return `${String.fromCharCode(97 + column)}${8 - row}`;
    }
    return `${String.fromCharCode(97 + 7 - column)}${row + 1}`;
  }

  private setPositions(row: number, column: number) {
    this.selectedColumn = column;
    this.selectedRow = row;
  }

  private async changePositions(
    row: number,
    column: number,
    fromSquare?: string,
    toSquare?: string
  ) {
    let fromField, toField;
    if (fromSquare && toSquare) {
      fromField = fromSquare;
      toField = toSquare;
    } else {
      fromField = this.getSquare(this.selectedRow!, this.selectedColumn!);
      toField = this.getSquare(row, column);
    }

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
    this.clearSelectedFields();
    this.clearPossibleMoves();
    if (this.gameService.whoseMove.value === this.color) {
      await this.chessService.supabase.from('moves').insert(data);
    }
    this.onWhoseMoveChange();
  }

  private reloadBoard() {
    this.board = this.chessInstance.board();
    if (this.color === 'b') {
      this.board.reverse();
      this.board.map((subarray) => subarray.reverse());
    } 
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

  private loadOnReload() {
    const moves = this.gameService.gameData.moves;
    const lastMove = moves.at(-1);
    console.log(lastMove);
    if (lastMove) {
      this.loadGameFromFEN(lastMove['FEN_after']);
      this.lastMove = {from: lastMove['from'], to: lastMove['to']};

      if (lastMove['color'] === 'white') {
        this.onWhoseMoveChange();
      }
    }
  }

  private loadGameFromFEN(fen: string) {
    this.chessInstance.load(fen);
    this.reloadBoard();
  }
}
