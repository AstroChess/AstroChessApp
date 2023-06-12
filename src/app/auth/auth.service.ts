import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogin, UserSignup } from './user.model';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<UserLogin | null>(null);

  constructor(private http: HttpClient) {
    this.autologin(
      environment.server.url + environment.server.loginEndpoint.endpoint
    );
  }

  autologin(url: string) {
    const user = localStorage.getItem('user');
    if (!user) return;
    return this.http
      .post<AuthResponse>(url, JSON.parse(user))
      .subscribe(() => this.user.next(JSON.parse(user)));
  }

  login(url: string, loginUserObject: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, loginUserObject);
  }

  signup(url: string, signupUserObject: UserSignup): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, signupUserObject);
  }
  logout() {
    localStorage.removeItem('user');
    this.user.next(null);
  }
}
