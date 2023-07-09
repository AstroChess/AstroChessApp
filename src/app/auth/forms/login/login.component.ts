import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

import { UserLogin } from '../../user.model';
import { AuthService } from '../../auth.service';
import { AuthResponse } from '../../auth-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginErrorMsg: string | null = null;
  submitted = false;
  user: UserLogin = {
    username: '',
    password: '',
    rememberMe: false,
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    const loginEndpoint =
      environment.server.url + environment.server.loginEndpoint.endpoint;
    this.authService.login(loginEndpoint, this.user).subscribe({
      next: (response: AuthResponse) => {
        if (response.status === 200) {
          this.loginErrorMsg = null;
          this.authService.user.next(this.user);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.loginErrorMsg = "This user doesn't exists";
        }
      },
    });
  }
}
