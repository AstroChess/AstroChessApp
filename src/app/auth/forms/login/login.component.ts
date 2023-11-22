import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { UserLogin } from '../../user.model';
import { AuthService } from '../../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginErrorMsg: string | null = null;
  submitted = false;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async login(form: NgForm) {
    const user: UserLogin = {
      email: form.controls['email'].value,
      password: form.controls['password'].value,
    };

    const result = await this.authService.login(user);
    if (result.error) {
      this.loginErrorMsg = result.error.message;
      return;
    }
    this.loginErrorMsg = null;
    this.router.navigate(['/']);
  }
}
