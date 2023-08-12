import { Injectable } from '@angular/core';
import { GameService } from '../game/game.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  lastMove = new Subject<{from: string, to: string}>();

  constructor(private gameService: GameService) { }

  getRowAndColumn(square: string) {
    let column, row;
    if (this.gameService.color === 'w') {
      column = +square.charCodeAt(0)-97;
      row = 8 - +square[1];
    } else {
      column = 97 + 7 - +square.charCodeAt(0);
      row = +square[1]-1;
    }
    return {column, row};
  }

  onWhoseMoveChange() {
    this.gameService.whoseMove.next(
      this.gameService.whoseMove.value === 'w' ? 'b' : 'w'
    );
  }

  highlightLastMove(from: string, to: string) {
    this.lastMove.next({ from, to });
  }
}
