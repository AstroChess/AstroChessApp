import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  user: any = {
    firstname: undefined,
    lastname: undefined,
    username: undefined,
    email: undefined,
    password: undefined,
    confirm_password: undefined,
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  handleSignupForm(){
    const signupEndpoint = environment.server.url + environment.server.signupEndpoint.endpoint;

    this.authService.signup(signupEndpoint, this.user).subscribe(x=>console.log(x))
  }

}
