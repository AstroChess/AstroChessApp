import { Component, OnInit, OnDestroy } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
    this.p2Interval = setInterval(() => {
      this.p2Time -= 100;
      if (this.p2Time === 0) {
        clearInterval(this.p2Interval);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    clearInterval(this.p2Interval);
  }
}
