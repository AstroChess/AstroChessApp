import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  supabase: SupabaseClient;
  channelChanges: any;
  createdGame = new Subject<{ time: number; gameId: string }>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.supabase = createClient(env.supabaseUrl, env.supabaseApi);
  }

  playAudio(type: 'check' | 'move' | 'notify') {
    const audio = new Audio(`/assets/sound/${type}.mp3`);
    audio.load();
    audio.play();
  }

  async createGame(minutes: number) {
    const playersColor = ['white_player', 'black_player'][
      Math.floor(Math.random() * 2)
    ];
    const insertData = {
      [playersColor]: this.authService.user.value?.id,
      minutes_per_player: minutes,
    };
    return await this.authService.supabase
      .from('games')
      .insert(insertData)
      .select('*')
      .single();
  }

  async findGame(minutesPerPlayer: number) {
    const { data: games } = await this.supabase
      .from('games')
      .select('*')
      .eq('minutes_per_player', minutesPerPlayer)
      .or(
        `and(black_player.neq.${this.authService.user.value?.id}, white_player.is.null), and(black_player.is.null, and(white_player.neq.${this.authService.user.value?.id}))`
      );

    if (games && games.length > 0) {
      const randomIndex = Math.floor(Math.random() * games.length);
      const chosenGame = games[randomIndex];
      const whichPlayer = chosenGame['white_player']
        ? 'black_player'
        : 'white_player';
      const gameId = chosenGame['game_id'];

      await this.supabase
        .from('games')
        .update({
          [whichPlayer]: this.authService.user.value?.id,
          started_utc: new Date().toUTCString(),
        })
        .eq('game_id', gameId);

      this.playAudio('notify');
      this.router.navigate(['game', gameId]);
      return;
    }

    const game = await this.createGame(minutesPerPlayer);

    if (game.error) {
      console.log('Some error occurred: ', game.error.message);
      return;
    }

    this.createdGame.next({
      time: minutesPerPlayer,
      gameId: game.data['game_id'],
    });

    const gameId = game.data['game_id'];
    const color = game.data['white_player'] ? 'w' : 'b';

    this.channelChanges = this.supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `game_id=eq.${gameId}`,
        },
        (payload: any) => {
          this.playAudio('notify');
          this.router.navigate(['game', gameId]);
          this.channelChanges.unsubscribe();
        }
      )
      .subscribe();
  }

  async searchCreatedGames() {
    const result = await this.supabase
      .from('games')
      .select('*')
      .or(
        `and(black_player.eq.${this.authService.user.value?.id}, white_player.is.null), and(black_player.is.null, and(white_player.eq.${this.authService.user.value?.id}))`
      );

    return result;
  }

  async deleteGame(gameId: string, time: number) {
    const {error} = await this.supabase
      .from('games')
      .delete()
      .eq('game_id', gameId);

    if(error) {
      console.log('Some error occurred: ', error);
      return;
    }

    this.createdGame.next({ time: time, gameId: '' });
  }
}
