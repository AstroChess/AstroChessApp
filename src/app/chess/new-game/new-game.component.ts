import { Component, OnInit } from '@angular/core';

import { ChessService } from '../chess.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  found1mGame!: boolean;
  found3mGame!: boolean;
  found5mGame!: boolean;
  found10mGame!: boolean;

  constructor(
    private chessService: ChessService
  ) {}

  async ngOnInit() {
    const foundGame = await this.chessService.searchCreatedGames();
    if(foundGame.error) {
      console.log(foundGame.error);
      return;
    }
    foundGame.data.forEach(game=>{
      switch(game.minutes_per_player) {
        case 1:
          this.found1mGame = true;
          break;
        case 3:
          this.found3mGame = true;
          break;
        case 5:
          this.found5mGame = true;
          break;
        case 10:
          this.found10mGame = true;
          break;
      }
    })
  }

  async findGame(minutesPerPlayer: number) {
    if(this.found1mGame || this.found3mGame || this.found5mGame || this.found10mGame) {
      return;
    }
    await this.chessService.findGame(minutesPerPlayer);
  }
}
