import { Component, OnInit } from '@angular/core';

import { ChessService } from '../chess.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  foundGame!: boolean;

  constructor(
    private chessService: ChessService
  ) {}

  async ngOnInit() {
    const foundGame = await this.chessService.searchCreatedGames();
    if(foundGame.error) {
      console.log(foundGame.error);
      return;
    }
    this.foundGame = !!foundGame.data.length;
  }

  async findGame(minutesPerPlayer: number) {
    if(this.foundGame) {
      await this.chessService.findGame(minutesPerPlayer);
    }
  }
}
