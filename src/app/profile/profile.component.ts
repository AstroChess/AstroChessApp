import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Game } from './game.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: any;
  games: Game[] = [];
  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.authService.user.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.games = this.route.snapshot.data['profileData'].data;
    console.log(this.route.snapshot.data['profileData'].data);
  }
}
