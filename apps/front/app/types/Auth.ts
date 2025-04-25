export interface AuthState {
  token: string | null;
  fulfilled?: boolean;
  pending?: boolean;
  rejected?: boolean;
  error?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
