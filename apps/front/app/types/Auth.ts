export interface AuthState {
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
