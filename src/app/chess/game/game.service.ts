import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

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

        if(localStorage.getItem('gameData')) {
            const gameData = JSON.parse(localStorage.getItem('gameData')!);
            const opponentId = gameData['white_player']===userId ? gameData['black_player'] : gameData['white_player'];
            const playerColor = gameData['white_player']===userId ? 'w' : 'b';
            this.gameData = gameData;

            return { username, opponentId, playerColor: playerColor };
        }

        const gameData = await this.fetchGameData(gameId);
        if(gameData.error) {
            return;
        }

        const opponentId = gameData['white_player']===userId ? gameData['black_player'] : gameData['white_player'];
        const playerColor = gameData['white_player']===userId ? 'w' : 'b';

        localStorage.setItem('gameData', JSON.stringify(gameData));
        this.gameData = gameData;
        
        return { username, opponentId, playerColor };
    }

    async fetchGameData(gameId: string) {
        const result = await this.authService.supabase.from('games').select('*').eq('game_id', gameId).single();
        if(result.error) {
            console.log(result.error);
            this.router.navigateByUrl('');
            return result;
        }
        return result.data;
    }

    async fetchUsername(userId: string) {
        const { data } = await this.authService.supabase.from('usernames').select('username').eq('userid', userId).single();
        console.log(data)
        return data;
    }
}