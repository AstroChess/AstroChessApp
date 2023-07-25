import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { GameService } from './game.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  player!: {userid: string, username: string};
  opponent!: {userid: string, username: string};
  color!: 'w' | 'b';
  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({gameData})=>{
      if(gameData.error) {
        console.log('error');
        return;
      }
      this.setInitialProperties(gameData.data);
    })
  }

  private async setInitialProperties(gameData: any) {
    if(gameData) {
      const playerColor = gameData.black_player.userid===this.authService.user.value!.id ? 'b' : 'w';
      this.player = playerColor==='w' ? gameData['white_player'] : gameData['black_player'];
      this.opponent = playerColor==='w' ? gameData['black_player'] : gameData['white_player'];
      this.color = (playerColor as 'w' | 'b');
    }
  }
}
