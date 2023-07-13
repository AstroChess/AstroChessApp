import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  contextMenuHidden = true;

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  hideNav() {
    this.contextMenuHidden = !this.contextMenuHidden;
  }

  logout() {
    this.authService.logout();
  }
}
