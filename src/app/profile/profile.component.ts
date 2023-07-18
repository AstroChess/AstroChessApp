import { Component, OnInit } from '@angular/core';

import { UserLogin } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: any;
  games = [
    {
      id: 1,
      p1: 'ketris',
      p2: 'astro',
      winner: 'p1',
    },
    {
      id: 1,
      p1: 'ketris',
      p2: 'astro',
      winner: 'p1',
    },
    {
      id: 1,
      p1: 'ketris',
      p2: 'astro',
      winner: 'p1',
    },
  ];
  constructor(private authService: AuthService) {
    this.authService.user.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {}
}
