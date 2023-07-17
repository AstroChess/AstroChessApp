import { Component, OnInit } from '@angular/core';



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

  constructor(private authService: AuthService) {
    
  }

  ngOnInit(): void {}

  async handleSignupForm() {
    const {data, error} = await this.authService.supabase.auth.signUp({
      email: this.user.email,
      password: this.user.password,
      options: {
        data: {
          username: this.user.username,
        }
      }
    })
    console.log(data);
    if(error) {
      console.log(error);
      return;
    }
    await this.authService.supabase.from('usernames').insert([{username: this.user.username, userid: data.user?.id }])

  }
}
