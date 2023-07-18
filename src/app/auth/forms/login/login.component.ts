import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { UserLogin } from '../../user.model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginErrorMsg: string | null = null;
  submitted = false;
  user: UserLogin = {
    email: '',
    password: '',
    rememberMe: false,
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async login() {
    const result = await this.authService.login(this.user);
    if (result.error) {
      this.loginErrorMsg = result.error.message;
    }
    this.loginErrorMsg = null;
    this.router.navigate(['/']);
  }
}
