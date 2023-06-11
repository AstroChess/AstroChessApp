import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<UserLogin | null>(null);

  constructor(private http: HttpClient) {
  }

  login(url: string, loginUserObject: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, loginUserObject);
  }

  signup(url: string, signupUserObject: UserSignup): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, signupUserObject);
  }
  logout(){
    this.user.next(null);
  }
}

interface AuthResponse {
  status: number;
  message: string;
}

interface UserLogin {
  username: string;
  password: string;
}

interface UserSignup {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    confirm_password: string
}