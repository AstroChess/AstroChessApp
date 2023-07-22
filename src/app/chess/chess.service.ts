import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  supabase: SupabaseClient;
  whoseMove = new BehaviorSubject<'w' | 'b' | 'finished'>('w');
  playerColor!: 'w' | 'b';
  opponent!: any


  constructor(private authService: AuthService, private router: Router) {
    this.supabase = createClient(env.supabaseUrl, env.supabaseApi);
  }

  playAudio(type: 'check' | 'move' | 'notify') {
    const audio = new Audio();
    audio.src = `/assets/sound/${type}.mp3`
    audio.load();
    audio.play();
  }

  async createGame(minutes: number) {
    const playersColor = ['white', 'black'][Math.floor(Math.random() * 2)];
    const insertData = {
      [`${playersColor}_player`]: this.authService.user.value.id,
      'minutes_per_player': minutes
    }
    return await this.authService.supabase.from('games').insert(insertData).select('*');
  }

  async findGame(minutesPerPlayer: number) {
    const { data: games } = await this.supabase
      .from('games')
      .select('*')
      .eq('minutes_per_player', minutesPerPlayer)
      .or(
        `and(black_player.neq.${this.authService.user.value.id}, white_player.is.null), and(black_player.is.null, and(white_player.neq.${this.authService.user.value.id}))`
      );

    if (games && games.length > 0) {
      const randomIndex = Math.floor(Math.random() * games.length);
      const chosenGame = games[randomIndex];
      const whichPlayer = chosenGame['white_player']
        ? 'black_player'
        : 'white_player';
      const gameId = chosenGame['game_id'];

      this.playerColor = whichPlayer==='white_player' ? 'w' : 'b';
      this.opponent = chosenGame['white_player'] || chosenGame['black_player'];
      
      await this.supabase
        .from('games')
        .update({ [whichPlayer]: this.authService.user.value.id })
        .eq('game_id', gameId);

      this.router.navigate(['game', gameId]);
      return;
    }

    const game = await this.createGame(minutesPerPlayer);

    if (game.error) {
      console.log('Some error occurred');
      return;
    }

    const gameId = game.data[0]['game_id'];
    const color = game.data[0]['white_player'] ? 'w' : 'b';

    this.supabase
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
          this.playerColor = color;
          this.opponent = payload.new[color==='w' ? 'black_player' : 'white_player'];
          this.playAudio('notify');
          this.router.navigate(['game', gameId]);
        }
      )
      .subscribe();
  }
}
