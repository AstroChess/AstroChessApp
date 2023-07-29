import { Component, OnInit } from '@angular/core';

import { UserSignup } from '../../user.model';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupError: string | undefined;
  signupResponse: string | undefined;
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

  async handleSignupForm() {
    this.signupError = undefined;
    this.signupResponse = undefined;

    const result = await this.authService.signup(this.user);
    if (result.error) {
      this.signupError = result.error.message;
      return;
    }

    this.signupResponse = 'Your account has been created!';
    await this.authService.supabase
      .from('users')
      .insert([
        {
          userid: result.data.user?.id,
          username: this.user.username.toLowerCase(),
          first_name: this.user.firstname.toLowerCase(),
          last_name: this.user.lastname.toLowerCase(),
        },
      ]);
  }
}
