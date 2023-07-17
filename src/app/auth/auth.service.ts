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
  user = new BehaviorSubject<any | null | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.supabase = createClient(env.supabaseUrl, env.supabaseApi);
    this.autologin();
  }

  async autologin() {
    const {data, error} = await this.supabase.auth.getSession();
    if (error) {
      this.user.next(null);
      return;
    }

    this.user.next(data.session?.user);
    
    console.log(data)
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
