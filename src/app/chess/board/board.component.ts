import { Component, OnInit, Input, ChangeDetectionStrategy, Self } from '@angular/core';

import { Chess, Square, PieceSymbol, Color } from 'chess.js';

import { ChessService } from '../chess.service';
import { GameService } from '../game/game.service';
import { BoardService } from './board.service';
import { BehaviorSubject } from 'rxjs';

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
  newMovesInsert: any
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  chessInstance: Chess = new Chess();
  board = new BehaviorSubject<({ square: Square; type: PieceSymbol; color: Color } | null)[][]>([[]]);
  possibleMoves: (string | undefined)[] = [];
  lastMove: { from: string; to: string } | undefined;
  promotionPiece: '' | 'q' | 'r' | 'n' | 'b' = '';
  promotionSquare: null | {row: number, column: number} = null;
  promotionChoose = false;

  constructor(
    private gameService: GameService,
    private chessService: ChessService,
    private boardService: BoardService
  ) {}

  async ngOnInit() {
    this.columnSymbolArray = this.color==='w' ? ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : ['', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']
    this.reloadBoard();
    this.loadOnReload();

    if(this.gameService.gameData['ended_utc']) {
      return;
    }

    this.boardService.lastMove.subscribe((move: any)=>{
      this.lastMove = move;
    })
    
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
            payload.new['color'] !== (this.color)
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
        !this.selectedColumn &&
        !this.selectedRow &&
        this.color !== field.color) ||
      (whoseMove !== this.color && mode === 'player') || 
      (possibleMoves.length===0 && !this.selectedColumn && !this.selectedRow)
    ) {
      return;
    }

    if (!this.selectedColumn && !this.selectedRow && this.board.value[row][column]) {
      if (field?.color === this.gameService.whoseMove.value) {
        this.highlightPossibleMoves(field?.square);
        this.setPositions(row, column);
      }
    } else if (
      this.selectedColumn !== null &&
      this.selectedRow !== null &&
      !(row === this.selectedRow && column === this.selectedColumn)
    ) {
      if (
        field?.color ===
        this.board.value[this.selectedRow][this.selectedColumn]?.color
      ) {
        this.highlightPossibleMoves(field?.square!);
        this.setPositions(row, column);
        this.clearPromotionProperties();
      } else if(this.board.value[this.selectedRow!][this.selectedColumn!]?.type==='p' && this.selectedRow===1) {
        if(!this.promotionPiece) {
          this.promotionChoose = true;
          this.promotionSquare = {row, column};
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
    if (this.color === 'w') {
      return `${String.fromCharCode(97 + column)}${8 - row}`;
    }
    return `${String.fromCharCode(97 + 7 - column)}${row + 1}`;
  }
  
  private getRowAndColumn(square: string) {
    return this.boardService.getRowAndColumn(square);
  }

  private setPositions(row: number, column: number) {
    this.selectedColumn = column;
    this.selectedRow = row;
  }

  private async changePositions(
    row: number,
    column: number,
  ) {
    let fromField = this.getSquare(this.selectedRow!, this.selectedColumn!);
    let toField = this.getSquare(row, column);
    
    const move = this.chessInstance.move({
      from: fromField,
      to: toField,
      promotion: this.promotionPiece
    });

    this.boardService.highlightLastMove(fromField, toField);

    this.chessInstance.load(move.after);
    this.reloadBoard();

    this.chessService.playAudio('move');

    const data = {
      game_id: this.gameService.gameData.game_id,
      user_id: this.gameService.player.userid,
      color: this.color,
      from: move.from,
      to: move.to,
      FEN_after: move.after,
      remaining_time_ms: this.gameService.timeToEnd,
      date_of_move: new Date().toUTCString()
    };
    this.clearSelections();
    if (this.gameService.whoseMove.value === this.color) {
      await this.chessService.supabase.from('moves').insert(data);
    }
    this.onWhoseMoveChange();
  }

  private reloadBoard() {
    if (this.color === 'w') {
      this.board.next(this.chessInstance.board());
    } else {
      const board = this.chessInstance.board().reverse();
      board.map((subarray: any[]) => subarray.reverse());
      this.board.next(board);
    } 
  }

  private clearSelectedFields() {
    this.selectedColumn = null;
    this.selectedRow = null;
  }

  private onWhoseMoveChange() {
    this.boardService.onWhoseMoveChange();
  }

  private highlightPossibleMoves(square: Square) {
    this.possibleMoves = this.chessInstance.moves({square, verbose: true}).map(val => val['to']);
  }

  private clearPossibleMoves() {
    this.possibleMoves = [];
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
    this.lastMove = {from: move['from'], to: move['to']};

    if ((init && move['color'] === 'w') || (!init && this.gameService.whoseMove.value!==this.color)) {
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
    event: any,
    field: { square: Square; type: PieceSymbol; color: Color } | null) {
      event.stopPropagation();
      this.setPromotionProperties(piece);
      this.handlePositionChange(this.promotionSquare!.row, this.promotionSquare!.column, field, 'player');
  }

  setPromotionProperties(piece: 'q' | 'r' | 'n' | 'b') {
    this.promotionPiece = piece;
  }

  private clearPromotionProperties() {
    this.promotionPiece = '';
    this.promotionSquare = null;
    this.promotionChoose = false;
  }
}
