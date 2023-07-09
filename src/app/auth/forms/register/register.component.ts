import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

import { UserSignup } from '../../user.model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupResponse!: { status: number; message: string } | null;
  submitted = false;
  user: UserSignup = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    terms: false,
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  handleSignupForm() {
    const signupEndpoint =
      environment.server.url + environment.server.signupEndpoint.endpoint;

    this.authService.signup(signupEndpoint, this.user).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.signupResponse = response;
        }
      },
      error: (err) => {
        this.signupResponse = err.error;
      },
    });
  }
}
