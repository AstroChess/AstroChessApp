import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    whoseMove = new BehaviorSubject<'w' | 'b' | 'finished'>('w');
    playerColor!: 'w' | 'b';
    player!: any;
    opponent!: any;
    
}