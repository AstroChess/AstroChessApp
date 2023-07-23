import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';

import { ChessService } from '../chess.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  playerName!: string
  opponentName!: string
  constructor(private authService: AuthService, private chessService: ChessService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const gameId = this.route.snapshot.params['id'];
    const gameData = await this.chessService.fetchGameData(gameId);
    const userName = this.authService.user.value.user_metadata.username;
    const opponentId = gameData['white_player']===userName ? gameData['black_player'] : gameData['white_player'];

    this.playerName = userName;
    this.opponentName = (await this.chessService.fetchUsername(opponentId))!.username;
  }
}
