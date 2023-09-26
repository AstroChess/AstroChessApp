import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class GameService {
    gameData: any = null;
    whoseMove = new BehaviorSubject<'w' | 'b' | 'finished'>('w');
    player!: any;
    opponent!: any;
    color!: 'w' | 'b';
    timeToEnd!: number;
    winner = new BehaviorSubject<'w' | 'b' | 'draw' | null>(null);

    constructor(private authService: AuthService) {
    }

    async finishGame(winner: 'w' | 'b' | 'draw' | null) {
        if(this.whoseMove.value !== 'finished') {
            this.stopGame();
            if(!this.gameData.ended_utc) {
                const {data} = await this.authService.supabase.from('games').update({ended_utc: new Date().toUTCString(), result: winner}).eq('game_id', this.gameData.game_id).select().single();
                this.gameData = data;
            }
            this.winner.next(this.gameData.result);
        }
    }

    stopGame() {
        this.whoseMove.next('finished');
    }

    createNewState(gameData: any, player: string, opponent: string, color: 'w' | 'b') {
        this.gameData = gameData;
        this.player = player;
        this.opponent = opponent;
        this.gameData = gameData
        this.color = color;
    }
}