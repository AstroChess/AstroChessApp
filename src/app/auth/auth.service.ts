import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any = null;

  constructor(private http: HttpClient) {}

  login(url: string, loginUserObject: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, loginUserObject);
  }

  signup(url: string, signupUserObject: UserSignup): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, signupUserObject);
  }
}

interface AuthResponse {
  status: string;
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