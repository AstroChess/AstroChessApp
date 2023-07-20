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
    this.user.next(data.session?.user ?? null);
  }

  async login(user: UserLogin) {
    const {data, error} = await this.supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    });

    if(error) {
      this.user.next(null);
      return {error};
    }

    this.user.next(data.user);
    return {data};
  }

  async signup(user: any) {
    const {data, error} = await this.supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          username: user.username,
        }
      }
    })

    if(error) {
      return {error};
    }

    return {data};
  }

  logout(): void {
    this.supabase.auth.signOut();
    this.user.next(null);
  }
}
