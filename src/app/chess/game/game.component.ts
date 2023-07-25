import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  playerName!: string;
  opponentName!: string;
  color!: 'w' | 'b';
  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const urlGameId = this.route.snapshot.params['id'];
    if(localStorage.getItem('gameData')) {
      const storageGameData =  JSON.parse(localStorage.getItem('gameData')!);
      if (storageGameData!==urlGameId) {
        localStorage.removeItem('gameData');
      }
    }
    this.setInitialProperties(urlGameId)
  }

  private async setInitialProperties(gameId: string) {
    const result = await this.gameService.storeInfo(gameId);
    if(result) {
      this.playerName = result.username;
      this.color = (result.playerColor as 'w' | 'b');
      this.opponentName = (await this.gameService.fetchUsername(result.opponentId))!.username;
    }
  }
}
