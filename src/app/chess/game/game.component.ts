import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from './game.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  player!: {userid: string, username: string} | null;
  opponent!: {userid: string, username: string} | null;
  color!: 'w' | 'b';
  constructor(private authService: AuthService, private gameService: GameService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({gameData})=>{
      if(gameData.error) {
        this.router.navigateByUrl('game');
        return;
      }
      if(gameData.data['white_player'].userid!==this.authService.user.value?.id && gameData.data['black_player'].userid!==this.authService.user.value?.id) {
        this.router.navigateByUrl('game');
        return;
      }
      this.setInitialProperties(gameData.data);
    })
  }

  private async setInitialProperties(gameData: any) {
    if(gameData) {
      const playerColor = gameData.black_player.userid===this.authService.user.value!.id ? 'b' : 'w';
      const player = playerColor==='w' ? gameData['white_player'] : gameData['black_player'];
      const opponent = playerColor==='w' ? gameData['black_player'] : gameData['white_player'];

      this.player = player;
      this.opponent = opponent;
      this.gameService.player = player;
      this.gameService.opponent = opponent;

      this.color = (playerColor as 'w' | 'b');
      this.gameService.gameData = gameData;
    }
  }
}
