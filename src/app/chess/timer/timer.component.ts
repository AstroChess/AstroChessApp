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
    this.color = this.gameService.gameData.white_player.userid===this.gameService.player.userid ? 'w' : 'b';

    const moves = this.gameService.gameData.moves;
    if(moves.length===0) {
      console.log(this.color)
      const startDate = this.gameService.gameData.started_utc as Date;
      const now = new Date();
      const nowDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

      if(this.color==='w') {
        this.p2Time = new Date(startDate).getTime() - new Date(nowDate).getTime() + this.gameService.gameData.minutes_per_player*60*1000;
      }
    }
    
    this.gameService.whoseMove.subscribe(
      (color: 'w' | 'b' | 'finished') => {
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
