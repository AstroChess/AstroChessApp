import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    gameData: any = null;
    whoseMove = new BehaviorSubject<'w' | 'b' | 'finished'>('w');
    player!: any;
    opponent!: any;
    timeToEnd!: number;

    constructor(private authService: AuthService) {}

    async fetchGameData(gameId: string) {
        const result = await this.authService.supabase.from('games').select('*, white_player(userid, username), black_player(userid, username), moves(FEN_after, color, from, to)').eq('game_id', gameId).single();
        if(result.error) {
            console.log(result.error);
        }
        console.log(result)
        return result;
    }
}