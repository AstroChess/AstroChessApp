import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  submitted: any;
  rememberMe: any;
  user: any = {};
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login() {
    const loginEndpoint = environment.server.url + environment.server.loginEndpoint.endpoint;
    console.log(this.user);
    this.authService.login(loginEndpoint, this.user).subscribe(x=>console.log(x))
  }
}
