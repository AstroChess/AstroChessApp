import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UserSignup } from '../../user.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signupResponse!: {status: number, message: string} | null
  submitted = false;
  user: UserSignup = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    terms: false
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  handleSignupForm(){
    const signupEndpoint = environment.server.url + environment.server.signupEndpoint.endpoint;

    this.authService.signup(signupEndpoint, this.user).subscribe({
      next: response =>{
        if(response.status === 200) {
          this.signupResponse = response
        }
      },
      error: err=>{
        this.signupResponse = err.error;
      }
    })
  }
}