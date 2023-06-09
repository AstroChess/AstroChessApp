import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends NbRegisterComponent implements OnInit {

  constructor(
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) override options: {},
    cd: ChangeDetectorRef,
    router: Router) { super(service, options, cd,router) }

  ngOnInit(): void {
  }

}
