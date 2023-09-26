import { Component, OnInit } from '@angular/core';
import { ChessService } from './chess.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss'],
  providers: [ChessService]
})
export class ChessComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
