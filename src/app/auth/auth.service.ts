import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';

import { UserLogin } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase: SupabaseClient;
  user = new BehaviorSubject<User | null | undefined>(undefined);

  constructor() {
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
    });
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
