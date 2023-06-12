import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthResponse } from '../../auth-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginErrorMsg: string | null = null;
  submitted: any;
  rememberMe: any;
  user: any = {};

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
