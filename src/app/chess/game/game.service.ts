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

    constructor(private authService: AuthService, private router: Router) {}

    async storeInfo(gameId: string) {
        const userId = this.authService.user.value?.id;
        const username = this.authService.user.value?.user_metadata['username'];
        let gameData;

        if(localStorage.getItem('gameData')) {
            gameData = JSON.parse(localStorage.getItem('gameData')!);
        } else {
            gameData = await this.fetchGameData(gameId);
            localStorage.setItem('gameData', JSON.stringify(gameData));
        }
        
        if(gameData.error) {
            this.router.navigateByUrl('');
            return;
        }
        gameData = gameData.data;
        const isPlayerWhite = gameData['white_player']===userId;
        const opponentId = isPlayerWhite ? gameData['black_player'] : gameData['white_player'];
        const playerColor = isPlayerWhite ? 'w' : 'b';
        this.gameData = gameData;
        
        return { username, opponentId, playerColor };
    }

    async fetchGameData(gameId: string) {
        const result = await this.authService.supabase.from('games').select('*, white_player(userid, username), black_player(userid, username)').eq('game_id', gameId).single();
        if(result.error) {
            console.log(result.error);
        }
        return result;
    }
}