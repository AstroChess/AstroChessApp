import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  whoseMove = new BehaviorSubject<'w' | 'b'>('w');

  constructor() {}

}
