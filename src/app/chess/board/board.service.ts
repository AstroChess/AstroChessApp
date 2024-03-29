import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Chess, Color, PieceSymbol, Square } from 'chess.js';

import { ChessService } from '../chess.service';
import { GameService } from '../game/game.service';

@Injectable()
export class BoardService implements OnDestroy {
  newMovesInsert!: RealtimeChannel;
  selected = new BehaviorSubject<{row: number, column: number} | null>(null);
  chessInstance: Chess = new Chess();
  board = new BehaviorSubject<({ square: Square; type: PieceSymbol; color: Color } | null)[][]>([[]]);
  possibleMoves = new BehaviorSubject<(string | never)[]>([]);
  promotion = new BehaviorSubject<{
    piece: '' | 'q' | 'r' | 'n' | 'b', 
    square: null | {row: number, column: number}, 
    choose: boolean 
  }>({ piece: '', square: null, choose: false })
  lastMove = new BehaviorSubject<{from: string, to: string} | undefined>(undefined);

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
        !this.selected.value?.column &&
        !this.selected.value?.row &&
        this.gameService.color !== field.color) ||
      (whoseMove !== this.gameService.color && mode === 'player') || 
      (possibleMoves.length===0 && !this.selected.value?.column && !this.selected.value?.row)
    ) {
      return;
    }

    if (!this.selected.value?.column && !this.selected.value?.row && this.board.value[row][column]) {
      if (field?.color === this.gameService.whoseMove.value) {
        this.highlightPossibleMoves(field?.square);
        this.setPositions(row, column);
      }
    } else if (
      this.selected.value?.column !== null &&
      this.selected.value?.row !== null &&
      !(row === this.selected.value?.row && column === this.selected.value?.column)
    ) {
      if (
        field?.color ===
        this.board.value[this.selected.value?.row!][this.selected.value?.column!]?.color
      ) {
        this.highlightPossibleMoves(field?.square!);
        this.setPositions(row, column);
        this.clearPromotionProperties();
      } else if(this.board.value[this.selected.value?.row!][this.selected.value?.column!]?.type==='p' && this.selected.value?.row===1) {
        if(!this.promotion.value.piece) {
          this.promotion.next({piece: '', square: {row, column}, choose: true});
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
      if(this.gameService.whoseMove.value!=="finished") {
        if(this.chessInstance.isDraw()) {
          await this.stopFinishedGame("draw");
        }
        if(this.chessInstance.isCheckmate()) {
          await this.stopFinishedGame(this.gameService.whoseMove.value);
        }
      }
    }
  }

  getSquare(row: number, column: number) {
    if (this.gameService.color === 'w') {
      return `${String.fromCharCode(97 + column)}${8 - row}`;
    }
    return `${String.fromCharCode(97 + 7 - column)}${row + 1}`;
  }
  
  private setPositions(row: number, column: number) {
    this.selected.next({row, column});
  }

  private async changePositions(
    row: number,
    column: number,
  ) {
    let fromField = this.getSquare(this.selected.value?.row!, this.selected.value?.column!);
    let toField = this.getSquare(row, column);

    try {
      const move = this.chessInstance.move({
        from: fromField,
        to: toField,
        promotion: this.promotion.value.piece
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
      };
      this.clearSelections();
      if (this.gameService.whoseMove.value === this.gameService.color) {
        await this.chessService.supabase.from('moves').insert(data);
      }
      this.onWhoseMoveChange();
    } catch (error) {
      console.log('Invalid move')
    }
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
    this.selected.next(null);
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
      this.lastMove.next(lastMove);
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

  private async stopFinishedGame(winner: "b" | "w" | "draw") {
    this.clearSelections();
    await this.gameService.finishGame(winner);
  }

  handlePiecePromotion(
    piece: 'q' | 'r' | 'n' | 'b',
    field: { square: Square; type: PieceSymbol; color: Color } | null) {
      this.setPromotionProperties(piece);
      this.handlePositionChange(this.promotion.value.square!.row, this.promotion.value.square!.column, field, 'player');
  }

  setPromotionProperties(piece: 'q' | 'r' | 'n' | 'b') {
    this.promotion.next({...this.promotion.value, piece: piece});
  }

  private clearPromotionProperties() {
    this.promotion.next({piece: '', square: null, choose: false});
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
