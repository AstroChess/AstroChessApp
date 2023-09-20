import { Injectable, OnDestroy } from '@angular/core';
import { GameService } from '../game/game.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Chess, Color, PieceSymbol, Square } from 'chess.js';
import { ChessService } from '../chess.service';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable()
export class BoardService implements OnDestroy {
  newMovesInsert!: RealtimeChannel;
  selectedRow = new BehaviorSubject<number | null>(null);
  selectedColumn = new BehaviorSubject<number | null>(null);
  chessInstance: Chess = new Chess();
  board = new BehaviorSubject<({ square: Square; type: PieceSymbol; color: Color } | null)[][]>([[]]);
  possibleMoves = new BehaviorSubject<(string | undefined)[]>([]);
  promotionPiece = new BehaviorSubject<'' | 'q' | 'r' | 'n' | 'b'>('');
  promotionSquare = new BehaviorSubject<null | {row: number, column: number}>(null);
  promotionChoose = new BehaviorSubject<boolean>(false);
  lastMove = new Subject<{from: string, to: string}>();

  constructor(private gameService: GameService, private chessService: ChessService) {}

  initialState() {
    this.reloadBoard();
    this.loadOnReload();

    if(this.gameService.gameData['ended_utc']) {
      return;
    }
    
    this.newMovesInsert = this.chessService.supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'moves',
          filter: `game_id=eq.${this.gameService.gameData.game_id}`,
        },
        (payload: any) => {
          if (
            payload.new['color'] !== (this.gameService.color)
          ) {
            this.loadGameFromFEN(payload.new);
          }
        }
      )
      .subscribe();
  }

  async handlePositionChange(
    row: number,
    column: number,
    field: { square: Square; type: PieceSymbol; color: Color } | null,
    mode: 'player' | 'opponent'
  ) {
    const whoseMove = this.gameService.whoseMove.value;
    const possibleMoves = this.chessInstance.moves({square: field?.square});
    if (
      whoseMove === 'finished' ||
      (field &&
        !this.selectedColumn.value &&
        !this.selectedRow.value &&
        this.gameService.color !== field.color) ||
      (whoseMove !== this.gameService.color && mode === 'player') || 
      (possibleMoves.length===0 && !this.selectedColumn.value && !this.selectedRow.value)
    ) {
      return;
    }

    if (!this.selectedColumn.value && !this.selectedRow.value && this.board.value[row][column]) {
      if (field?.color === this.gameService.whoseMove.value) {
        this.highlightPossibleMoves(field?.square);
        this.setPositions(row, column);
      }
    } else if (
      this.selectedColumn.value !== null &&
      this.selectedRow.value !== null &&
      !(row === this.selectedRow.value && column === this.selectedColumn.value)
    ) {
      if (
        field?.color ===
        this.board.value[this.selectedRow.value][this.selectedColumn.value]?.color
      ) {
        this.highlightPossibleMoves(field?.square!);
        this.setPositions(row, column);
        this.clearPromotionProperties();
      } else if(this.board.value[this.selectedRow.value!][this.selectedColumn.value!]?.type==='p' && this.selectedRow.value===1) {
        if(!this.promotionPiece.value) {
          this.promotionChoose.next(true);
          this.promotionSquare.next({row, column});
          return;
        }
        this.changePositions(row, column);
        this.clearPromotionProperties();
      } else {
        this.clearPromotionProperties();
        this.changePositions(row, column);
      }
    } else {
      this.clearPromotionProperties();
      this.clearSelectedFields();
      this.clearPossibleMoves();
    }

    if (this.chessInstance.isGameOver()) {
      if(this.newMovesInsert) {
        this.newMovesInsert.unsubscribe();
      }
      await this.stopFinishedGame();
    }
  }

  getSquare(row: number, column: number) {
    if (this.gameService.color === 'w') {
      return `${String.fromCharCode(97 + column)}${8 - row}`;
    }
    return `${String.fromCharCode(97 + 7 - column)}${row + 1}`;
  }
  
  private setPositions(row: number, column: number) {
    this.selectedColumn.next(column);
    this.selectedRow.next(row);
  }

  private async changePositions(
    row: number,
    column: number,
  ) {
    let fromField = this.getSquare(this.selectedRow.value!, this.selectedColumn.value!);
    let toField = this.getSquare(row, column);
    
    const move = this.chessInstance.move({
      from: fromField,
      to: toField,
      promotion: this.promotionPiece.value
    });

    this.highlightLastMove(fromField, toField);

    this.chessInstance.load(move.after);
    this.reloadBoard();

    this.chessService.playAudio('move');

    const data = {
      game_id: this.gameService.gameData.game_id,
      user_id: this.gameService.player.userid,
      color: this.gameService.color,
      from: move.from,
      to: move.to,
      FEN_after: move.after,
      remaining_time_ms: this.gameService.timeToEnd,
      date_of_move: new Date().toUTCString()
    };
    this.clearSelections();
    if (this.gameService.whoseMove.value === this.gameService.color) {
      await this.chessService.supabase.from('moves').insert(data);
    }
    this.onWhoseMoveChange();
  }

  private reloadBoard() {
    if (this.gameService.color === 'w') {
      this.board.next(this.chessInstance.board());
    } else {
      const board = this.chessInstance.board().reverse();
      board.map((subarray: any[]) => subarray.reverse());
      this.board.next(board);
    } 
  }

  private clearSelectedFields() {
    this.selectedColumn.next(null);
    this.selectedRow.next(null);
  }

  private onWhoseMoveChange() {
    this.gameService.whoseMove.next(
      this.gameService.whoseMove.value === 'w' ? 'b' : 'w'
    );
  }

  private highlightPossibleMoves(square: Square) {
    this.possibleMoves.next(this.chessInstance.moves({square, verbose: true}).map(val => val['to']));
  }

  private clearPossibleMoves() {
    this.possibleMoves.next([]);
  }

  private loadOnReload() {
    const moves = this.gameService.gameData.moves;
    const lastMove = moves.at(-1);
    if (lastMove) {
      this.loadGameFromFEN(lastMove, true);
    }
  }

  private loadGameFromFEN(move: any, init?: boolean) {
    if (!move) {
      return;
    }

    this.clearSelections();
    this.chessInstance.load(move['FEN_after']);
    this.lastMove.next({from: move['from'], to: move['to']});

    if ((init && move['color'] === 'w') || (!init && this.gameService.whoseMove.value!==this.gameService.color)) {
      this.onWhoseMoveChange();
    }

    if(!init) {
      this.chessService.playAudio('move');
    }

    this.reloadBoard();
  }

  private clearSelections() {
    this.clearSelectedFields();
    this.clearPossibleMoves();
  }

  private async stopFinishedGame() {
    this.clearSelections();
    await this.gameService.finishGame(null);
  }

  handlePiecePromotion(
    piece: 'q' | 'r' | 'n' | 'b',
    field: { square: Square; type: PieceSymbol; color: Color } | null) {
      this.setPromotionProperties(piece);
      this.handlePositionChange(this.promotionSquare.value!.row, this.promotionSquare.value!.column, field, 'player');
  }

  setPromotionProperties(piece: 'q' | 'r' | 'n' | 'b') {
    this.promotionPiece.next(piece);
  }

  private clearPromotionProperties() {
    this.promotionPiece.next('');
    this.promotionSquare.next(null);
    this.promotionChoose.next(false);
  }

  highlightLastMove(from: string, to: string) {
    this.lastMove.next({ from, to });
  }

  ngOnDestroy(): void {
    if(this.newMovesInsert) {
      this.newMovesInsert.unsubscribe();
    }
  }
}
