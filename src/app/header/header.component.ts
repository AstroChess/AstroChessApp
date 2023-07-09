import { Component, OnInit } from '@angular/core';

import { take } from 'rxjs';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private nbMenuService: NbMenuService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    this.nbMenuService
      .onItemClick()
      .pipe(take(1))
      .subscribe((e) => {
        if (e.item?.data?.id == 'logout') {
          this.authService.logout();
        }
      });
  }

  loggedinItems: NbMenuItem[] = [
    {
      title: 'Profile',
      link: '/profile',
    },
    {
      title: 'Logout',
      data: { id: 'logout' },
    },
  ];

  loggedoutItems: NbMenuItem[] = [
    {
      title: 'Login',
      link: '/auth/login',
    },
    {
      title: 'Register',
      link: '/auth/register',
    },
  ];
}
