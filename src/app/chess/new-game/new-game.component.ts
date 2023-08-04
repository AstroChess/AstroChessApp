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
    switch (minutesPerPlayer) {
      case 1:
        if(this.found1mGame) return;
        this.found1mGame=true;
        break;
      case 3:
        if(this.found3mGame) return;
        this.found3mGame=true;
        break;
      case 5:
        if(this.found5mGame) return;
        this.found5mGame=true;
        break;
      case 10:
        if(this.found10mGame) return;
        this.found10mGame=true;
        break;
    }
    await this.chessService.findGame(minutesPerPlayer);
  }
}
