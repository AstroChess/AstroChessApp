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
    username: '',
    password: '',
    rememberMe: false,
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async login() {
    const {data, error} = await this.authService.supabase.auth.signInWithPassword({
      email: this.user.email,
      password: this.user.password
    });

    if(error) {
      console.log(error);
      this.loginErrorMsg = error.message;
      return;
    }
    
    this.user.username = data.user.user_metadata['username'];
    this.loginErrorMsg = null;
    this.authService.user.next(this.user);
    console.log(this.authService.user);
    console.log(localStorage);
    this.router.navigate(['/']);
  }
}
