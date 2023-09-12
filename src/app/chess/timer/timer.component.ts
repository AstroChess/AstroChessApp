import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { GameService } from '../game/game.service';
import { ChessService } from '../chess.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() playerName!: string;
  @Input() opponentName!: string;
  color!: 'w' | 'b';
  p1Time!: number;
  p2Time!: number;
  p1Interval: any;
  p2Interval: any;
  
  constructor(private gameService: GameService, private chessService: ChessService) {}
  
  async ngOnInit() {
    this.color = this.gameService.gameData.white_player.userid===this.gameService.player.userid ? 'w' : 'b';

    const moves: any[] = this.gameService.gameData.moves;
    const timePerPlayer = this.gameService.gameData.minutes_per_player*60*1000;
    const now = new Date();
    const nowDateUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const startDate = this.gameService.gameData.started_utc as Date;

    if(moves.length===0) {
      const remainingTime = new Date(startDate).getTime() - new Date(nowDateUTC).getTime() + timePerPlayer;

      if(this.color==='w') {
        this.p1Time = timePerPlayer;
        this.p2Time = remainingTime;
      } else {
        this.p1Time = remainingTime;
        this.p2Time = timePerPlayer;
      }
    } else if(moves.length===1) {
      const timeDiff = new Date(moves[0].date_of_move).getTime() - new Date(nowDateUTC).getTime();
      if(this.color==='w') {
        this.p1Time = timeDiff + timePerPlayer;
        this.p2Time = moves[0].remaining_time_ms;
      } else {
        this.p1Time = moves[0].remaining_time_ms;
        this.p2Time = timeDiff + timePerPlayer;
      }
    } else {
      const lastTwoMoves = moves.slice(-2);
      if(lastTwoMoves[1].color === this.color) {
        this.p1Time = new Date(lastTwoMoves[1].date_of_move).getTime() - new Date(nowDateUTC).getTime() + lastTwoMoves[0].remaining_time_ms;
        this.p2Time = lastTwoMoves[1].remaining_time_ms;
      } else {
        this.p1Time = lastTwoMoves[1].remaining_time_ms;
        this.p2Time = new Date(lastTwoMoves[1].date_of_move).getTime() - new Date(nowDateUTC).getTime() + lastTwoMoves[0].remaining_time_ms;
      }
    }

    if (this.p2Time <= 0) {
      await this.gameService.finishGame(this.color==='w' ? 'b' : 'w');
      return;
    } else if (this.p1Time <= 0) {
      await this.gameService.finishGame(this.color);
      return;
    }
    
    this.gameService.whoseMove.pipe(filter(whoseMove=>whoseMove!=='finished')).subscribe(
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
            if (this.p2Time <= 0) {
              this.gameService.finishGame(this.color==='w' ? 'b' : 'w');
              this.clearIntervals();
            }
          }, 100);
        } else {
          this.p1Interval = setInterval(() => {
            if (this.color===color) {
              clearInterval(this.p1Interval);
              return;
            }
            this.p1Time -= 100;
            if (this.p1Time <= 0) {
              this.gameService.finishGame(this.color);
              this.clearIntervals();
            }
          }, 100);
        }
      }
    );
  }

  private clearIntervals() {
    clearInterval(this.p1Interval);
    clearInterval(this.p2Interval);
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }
}
