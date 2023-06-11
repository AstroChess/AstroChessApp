import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService, private nbMenuService: NbMenuService) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => (this.isLoggedIn = !!user));

    this.nbMenuService.onItemClick().pipe(take(1)).subscribe((e)=>{ if(e.item?.data?.id == "logout"){ this.authService.logout() } })
  }

  loggedoutItems: NbMenuItem[] = [
    {
      title: 'Logout',
      data: {id: 'logout'}
    },
  ];

  loggedinItems: NbMenuItem[] = [
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
