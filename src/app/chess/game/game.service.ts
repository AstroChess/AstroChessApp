import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    gameData = null;
    whoseMove = new BehaviorSubject<'w' | 'b' | 'finished'>('w');
    player!: any;
    opponent!: any;

    constructor(private authService: AuthService) {}

    async fetchGameData(gameId: string) {
        const result = await this.authService.supabase.from('games').select('*, white_player(userid, username), black_player(userid, username)').eq('game_id', gameId).single();
        if(result.error) {
            console.log(result.error);
        }
        return result;
    }
}