import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  whoseMove = new BehaviorSubject<'w' | 'b' | 'finished'>('w');

  constructor() {
  }

  playAudio(type: 'check' | 'move' | 'notify') {
    const audio = new Audio();
    audio.src = `/assets/sound/${type}.mp3`
    audio.load();
    audio.play();
  }
}
