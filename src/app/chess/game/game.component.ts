import { ActivatedRoute } from '@angular/router';
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
    const gameId = this.route.snapshot.params['id'];
    const {username, opponentId, playerColor} = await this.gameService.storeInfo(gameId);
    
    this.playerName = username;
    this.color = (playerColor as 'w' | 'b');
    this.opponentName = (await this.gameService.fetchUsername(opponentId))!.username;
  }
}
