import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import {
  NB_AUTH_OPTIONS,
  NbAuthService,
  NbLoginComponent,
} from '@nebular/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent implements OnInit {
  constructor(
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) override options: {},
    cd: ChangeDetectorRef,
    router: Router
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {}

  
}
