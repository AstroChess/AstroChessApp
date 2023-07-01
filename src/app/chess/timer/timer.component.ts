import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  p1Time = 60*5;
  p2Time = 60*5;

  constructor() { }

  ngOnInit(): void {
    setInterval(()=>{
      this.p2Time--;
    },1000)
  }



}
