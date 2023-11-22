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
export class ProfileResolver {
  constructor(private authService: AuthService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> {
    return this.fetchGameHistory();
  }

  async fetchGameHistory() {
    const result = await this.authService.supabase.from('games').select('white_player(userid, username), black_player(userid, username), started_utc, result').or(`white_player.eq.${this.authService.user.value?.id},black_player.eq.${this.authService.user.value?.id}`);
    if(result.error) {
        console.log('Some error occurred in fetching data: ', result.error);
    }
    console.log(result);
    return result;
  }
}
