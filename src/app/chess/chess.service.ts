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

  constructor(private authService: AuthService) {
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
      [playersColor+'_player']: this.authService.user.value.id,
      'minutes_per_player': minutes
    }
    return await this.authService.supabase.from('games').insert(insertData).select('*');
  }
}
