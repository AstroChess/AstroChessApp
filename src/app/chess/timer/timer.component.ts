import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { GameService } from '../game/game.service';
import { ChessService } from '../chess.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() playerName!: string;
  @Input() opponentName!: string;
  color!: 'w' | 'b';
  p1Time = 60 * 5 * 1000;
  p2Time = 60 * 5 * 1000;
  p1Interval: any;
  p2Interval: any;
  
  constructor(private gameService: GameService, private chessService: ChessService) {}
  
  ngOnInit(): void {
    this.p1Time = (this.p2Time = this.gameService.gameData.minutes_per_player * 60 * 1000);
    this.color = this.gameService.gameData.white_player.userid===this.gameService.player.userid ? 'w' : 'b';
    
    this.gameService.whoseMove.subscribe(
      (color: 'w' | 'b' | 'finished') => {
        console.log(this.gameService.player.userid, this.gameService.gameData.white_player.userid, 'abc')
        const whitePlayer = this.gameService.gameData.white_player.userid;
        const blackPlayer = this.gameService.gameData.black_player.userid;

        if ((color==='w' && this.gameService.player.userid===whitePlayer) || (color==='b' && this.gameService.player.userid===blackPlayer)) {
          this.p2Interval = setInterval(() => {
            if (this.color!==color) {
              clearInterval(this.p2Interval);
              return;
            }
            this.p2Time -= 100;
            this.gameService.timeToEnd = this.p2Time;
            if (this.p2Time === 0) {
              clearInterval(this.p2Interval);
            }
          }, 100);
          clearInterval(this.p1Interval);
        } else {
          this.p1Interval = setInterval(() => {
            if (this.color===color) {
              clearInterval(this.p1Interval);
              return;
            }
            this.p1Time -= 100;
            if (this.p1Time === 0) {
              clearInterval(this.p1Interval);
            }
          }, 100);
          clearInterval(this.p2Interval);
        }
      }
    );

  }

  ngOnDestroy(): void {
    clearInterval(this.p1Interval);
    clearInterval(this.p2Interval);
  }
}
