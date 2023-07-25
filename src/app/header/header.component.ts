import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { filter } from 'rxjs';
import { User } from '@supabase/supabase-js';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  contextMenuHidden = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user
      .pipe(filter((user) => user !== undefined))
      .subscribe((user) => {
        this.user = user as User | null;
      });
  }

  hideNav() {
    this.contextMenuHidden = !this.contextMenuHidden;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
