import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitted: any;
  rememberMe: any;
  user: any = {};
  
  constructor() {}

  ngOnInit(): void {}

  login() {
    console.log(this.user);
  }
}
