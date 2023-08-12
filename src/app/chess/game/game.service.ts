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
    color!: string;
    timeToEnd!: number;

    constructor(private authService: AuthService) {}

    async fetchGameData(gameId: string) {
        const result = await this.authService.supabase.from('games').select('*, minutes_per_player, white_player(userid, username), black_player(userid, username), moves(FEN_after, color, from, to)').eq('game_id', gameId).single();
        if(result.error) {
            console.log('Some error occurred: ', result.error);
        }
        return result;
    }

    async finishGame() {
        this.whoseMove.next('finished');
        await this.authService.supabase.from('games').update({ended_utc: new Date().toUTCString()}).eq('game_id', this.gameData.game_id);
    }
}