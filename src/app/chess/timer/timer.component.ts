import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { RealtimeChannel, SupabaseClient, createClient } from '@supabase/supabase-js';

import { GameService } from '../game/game.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() playerName!: string;
  @Input() opponentName!: string;

  supabaseWinner!: SupabaseClient;
  supabaseWinnerSub!: RealtimeChannel;
  whoseMoveSub!: Subscription;
  color!: 'w' | 'b';
  p1Time!: number;
  p2Time!: number;
  p1Interval: any;
  p2Interval: any;
  winner!: 'w' | 'b' | 'draw' | null;
  winnerSub!: Subscription;
  
  constructor(private gameService: GameService) {
    this.supabaseWinner = createClient(env.supabaseUrl, env.supabaseApi);
    this.supabaseWinnerSub = this.supabaseWinner
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `game_id=eq.${this.gameService.gameData.game_id}`,
        },
        async (payload) => {
          if(payload.new['result']) {
            this.gameService.finishGame(payload.new['result']);
            this.supabaseWinnerSub.unsubscribe();
          }
        }
      ).subscribe();
  }
  
  async ngOnInit() {
    this.winnerSub = this.gameService.winner.subscribe(
      winner => { 
        this.winner = winner;
        this.stopTimers();
      }
    )

    this.color = this.gameService.gameData.white_player.userid===this.gameService.player.userid ? 'w' : 'b';

    const moves: any[] = this.gameService.gameData.moves;
    const timePerPlayer = this.gameService.gameData.minutes_per_player*60*1000;
    const nowDateUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60000);
    const startDate = this.gameService.gameData.started_utc as Date;

    this.calculateTime(moves, timePerPlayer, nowDateUTC, startDate);
    
    if(this.winner) {
      this.calculateTime(moves, timePerPlayer, this.gameService.gameData.ended_utc, startDate);
      return;
    }

    const winner = this.checkTimeForWinner();
    
    if(!winner) {
      this.whoseMoveSub = this.gameService.whoseMove.subscribe(
        (color: 'w' | 'b' | 'finished') => {
          this.stopTimers();
          
          if(color==='finished') {
            return;
          };

          this.setTimers(color);
        }
      );
    }
  }

  stopTimers() {
    clearInterval(this.p1Interval);
    clearInterval(this.p2Interval);
  }

  private checkTimeForWinner() {
    if (this.p2Time <= 0) {
      const opponentColor = this.color==='w' ? 'b' : 'w';
      this.gameService.finishGame(opponentColor);
      return opponentColor;
    }
    if (this.p1Time <= 0) {
      this.gameService.finishGame(this.color);
      return this.color;
    }
    return null;
  }

  surrender() {
    this.stopTimers();
    this.gameService.finishGame(this.color==='w' ? 'b' : 'w');
  }

  calculateTime(moves: any[], timePerPlayer: number, nowDateUTC: Date, startDate: Date) {
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
  }

  private setTimers(color: 'w' | 'b') {
    if ((color==='w' && this.color==='w') || (color==='b' && this.color==='b')) {
      this.p2Interval = setInterval(() => {
        this.p2Time -= 100;
        this.gameService.timeToEnd = this.p2Time;
        if (this.p2Time <= 0) {
          this.gameService.finishGame(this.color==='w' ? 'b' : 'w');
          if(this.whoseMoveSub) {
            this.whoseMoveSub.unsubscribe();
          }
          this.stopTimers();
        }
      }, 100);
    } else {
      this.p1Interval = setInterval(() => {
        this.p1Time -= 100;
        if (this.p1Time <= 0) {
          this.gameService.finishGame(this.color);
          if(this.whoseMoveSub) {
            this.whoseMoveSub.unsubscribe();
          }
          this.stopTimers();
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.stopTimers();
    if(this.winnerSub) {
      this.winnerSub.unsubscribe();
    }
    if(this.supabaseWinnerSub) {
      this.supabaseWinnerSub.unsubscribe();
    }
  }
}
