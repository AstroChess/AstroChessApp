import { Component, OnInit } from '@angular/core';

import { ChessService } from '../chess.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  foundGameChanges!: Subscription;
  foundGamesId: { [key: number]: string } = {
    1: '',
    3: '',
    5: '',
    10: '',
  };

  constructor(private chessService: ChessService, private authService: AuthService) {}

  ngOnInit() {
    this.chessService.supabase
      .from('games')
      .delete()
      .or(
        `and(black_player.eq.${this.authService.user.value?.id}, white_player.is.null), and(black_player.is.null, and(white_player.eq.${this.authService.user.value?.id}))`
      );

    this.chessService.createdGame.subscribe(async (val) => {
      await this.fetchAndMarkCreatedGames();
      this.foundGamesId[val.time] = val.gameId;
    });
  }

  async findGame(minutesPerPlayer: number) {
    if (this.foundGamesId[minutesPerPlayer]) {
      await this.deleteGame(
        this.foundGamesId[minutesPerPlayer],
        minutesPerPlayer
      );
    } else {
      [1, 3, 5, 10]
        .filter((val) => val !== minutesPerPlayer)
        .forEach(async (minutes) => {
          if (this.foundGamesId[minutes]) {
            await this.deleteGame(this.foundGamesId[minutes], minutes);
          }
        });
      await this.chessService.findGame(minutesPerPlayer);
    }
  }

  async deleteGame(gameId: string, time: number) {
    await this.chessService.deleteGame(gameId, time);
  }

  async fetchAndMarkCreatedGames() {
    const foundGame = await this.chessService.searchCreatedGames();
    if (foundGame.error) {
      console.log('Some error occurred: ', foundGame.error);
      return;
    }
    foundGame.data.forEach((game) => {
      switch (game.minutes_per_player) {
        case 1:
          this.foundGamesId[1] = game.game_id;
          break;
        case 3:
          this.foundGamesId[3] = game.game_id;
          break;
        case 5:
          this.foundGamesId[5] = game.game_id;
          break;
        case 10:
          this.foundGamesId[10] = game.game_id;
          break;
      }
    });
  }
}
