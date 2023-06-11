import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signinFailure: string | null = null;
  submitted: any;
  rememberMe: any;
  user: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    const loginEndpoint =
      environment.server.url + environment.server.loginEndpoint.endpoint;
    this.authService.login(loginEndpoint, this.user).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.signinFailure = null;
          this.authService.user.next(this.user);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.signinFailure = "This user doesn't exists";
        }
      },
    });
  }
}
