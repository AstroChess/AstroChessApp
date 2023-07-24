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

    async storeInfo(gameId: string) {
        const gameData = await this.fetchGameData(gameId);
        const userId = this.authService.user.value?.id;
        const username = this.authService.user.value?.user_metadata['username'];
        const opponentId = gameData['white_player']===userId ? gameData['black_player'] : gameData['white_player'];
        const playerColor = gameData['white_player']===userId ? 'w' : 'b';
        console.log(playerColor)
        this.gameData = gameData;
        
        return { username, opponentId, playerColor: playerColor };
    }

    async fetchGameData(gameId: string) {
        const { data } = await this.authService.supabase.from('games').select('*').eq('game_id', gameId).single();
        return data;
    }

    async fetchUsername(userId: string) {
        const { data } = await this.authService.supabase.from('usernames').select('username').eq('userid', userId).single();
        console.log(data)
        return data;
    }
}