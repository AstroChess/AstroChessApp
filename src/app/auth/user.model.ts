export interface UserLogin {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserSignup {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface User {
  aud: string;
  confirmed_at: Date;
  created_at: Date;
  email: string;
  email_confirmed_at: Date;
  id: string;
  last_sign_in_at: Date;
  user_metadata: { username: string };
}
