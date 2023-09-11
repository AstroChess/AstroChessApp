import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";

@Injectable()
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

    createNewState(gameData: any, player: string, opponent: string, color: string) {
        this.gameData = gameData;
        this.player = player;
        this.opponent = opponent;
        this.gameData = gameData
        this.color = color;
    }
}