import { Component } from '@angular/core';
import { ChessService } from '../chess.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent {
  constructor(
    private chessService: ChessService,
    private authService: AuthService
  ) {}

  async findGame(minutesPerPlayer: number) {
    const { data: games } = await this.chessService.supabase
      .from('games')
      .select('*')
      .eq('minutes_per_player', minutesPerPlayer)
      .or(
        `and(black_player.neq.${this.authService.user.value.id}, white_player.is.null), and(black_player.is.null, and(white_player.neq.${this.authService.user.value.id}))`
      );

    if (games && games.length > 0) {
      const randomIndex = Math.floor(Math.random() * games.length);
      const chosenGame = games[randomIndex];
      const whichPlayer = games[randomIndex]['white_player']
        ? 'white_player'
        : 'black_player';
      const gameId = chosenGame['game_id'];
      await this.chessService.supabase.from('games').update({[whichPlayer]: this.authService.user.value.id}).eq('game_id', gameId);
      return;
    }
    const game = await this.chessService.createGame(minutesPerPlayer);
    if(game.error) {
      console.log('Some error occurred');
      return;
    }
    const gameId = game.data[0]['game_id'];
    
  }
}
