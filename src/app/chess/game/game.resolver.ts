import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameResolver {
  constructor(private authService: AuthService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> {
    const gameId = route.paramMap.get('id');
    return this.fetchGameData(gameId!);
  }

  async fetchGameData(gameId: string) {
    const result = await this.authService.supabase.from('games').select('*, minutes_per_player, white_player(userid, username), black_player(userid, username), moves(FEN_after, color, from, to, date_of_move, remaining_time_ms), started_utc').eq('game_id', gameId).single();
    if(result.error) {
        console.log('Some error occurred: ', result.error);
    }
    return result;
}
}
