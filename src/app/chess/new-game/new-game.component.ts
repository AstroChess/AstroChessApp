import { Component } from '@angular/core';

import { ChessService } from '../chess.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent {
  constructor(
    private chessService: ChessService
  ) {}

  async findGame(minutesPerPlayer: number) {
    await this.chessService.findGame(minutesPerPlayer);
  }
}
