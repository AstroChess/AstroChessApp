import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { AuthResponse } from './auth-response';
import { UserLogin, UserSignup } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase: SupabaseClient;
  user = new BehaviorSubject<UserLogin | null | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.supabase = createClient(env.supabaseUrl, env.supabaseApi);
  }

  autologin(url: string): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.user.next(null);
      return;
    }
    this.http.post<AuthResponse>(url, JSON.parse(user)).subscribe({
      next: () => this.user.next(JSON.parse(user)),
      error: (error) => {
        this.logout();
      },
    });
  }

  login(url: string, loginUserObject: UserLogin): Observable<AuthResponse> {
    localStorage.setItem('user', JSON.stringify(loginUserObject));
    return this.http.post<AuthResponse>(url, loginUserObject);
  }

  signup(url: string, signupUserObject: UserSignup): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, signupUserObject);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user.next(null);
  }
}
