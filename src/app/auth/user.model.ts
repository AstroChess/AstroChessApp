export interface UserLogin {
  username: string;
  password: string;
  rememberMe?: boolean
}

export interface UserSignup {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  terms?: boolean
}