import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChessService } from '../chess.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  p1Time = 60 * 5 * 1000;
  p2Time = 60 * 5 * 1000;
  p1Interval: any;
  p2Interval: any;

  constructor(private chessService: ChessService) {}

  ngOnInit(): void {
    this.chessService.whoseMove.subscribe(
      color => {
        if (color==='w') {
          this.p2Interval = setInterval(() => {
            if (this.chessService.whoseMove.value === 'b') {
              clearInterval(this.p2Interval);
              return;
            }
            this.p2Time -= 100;
            if (this.p2Time === 0) {
              clearInterval(this.p2Interval);
            }
          }, 100);
        } else {
          this.p1Interval = setInterval(() => {
            if (this.chessService.whoseMove.value === 'w') {
              clearInterval(this.p1Interval);
              return;
            }
            this.p1Time -= 100;
            if (this.p1Time === 0) {
              clearInterval(this.p1Interval);
            }
          }, 100);
        }
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.p1Interval);
    clearInterval(this.p2Interval);
  }
}
