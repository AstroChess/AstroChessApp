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
    winner: string | null = null; 

    constructor(private authService: AuthService) {
        this.whoseMove.subscribe(val=>console.log('debbuging color value changes ->', val))
    }

    async fetchGameData(gameId: string) {
        const result = await this.authService.supabase.from('games').select('*, minutes_per_player, white_player(userid, username), black_player(userid, username), moves(FEN_after, color, from, to, date_of_move, remaining_time_ms), started_utc').eq('game_id', gameId).single();
        if(result.error) {
            console.log('Some error occurred: ', result.error);
        }
        return result;
    }

    async finishGame(winner: string | null) {
        console.log('finished by finishGame in gameservice');
        if(this.whoseMove.value !== 'finished') {
            this.winner = winner;
            this.whoseMove.next('finished');
            if(!this.gameData.ended_utc) {
                const {data} = await this.authService.supabase.from('games').update({ended_utc: new Date().toUTCString(), result: winner}).eq('game_id', this.gameData.game_id).select().single();
                this.gameData = data;
            }
        }
    }
}