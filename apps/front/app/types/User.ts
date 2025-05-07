export interface UserState {
  user: User | null;
  //
  token?: string | null;
  isAuthenticated?: Boolean;
  error?: string | null;
  redirectTo?: string | null;
}

export interface User {
  firstName: string;
  lastName: string;
  email?: string;
  //
  createdAt?: string;
  id?: string;
  updatedAt?: string;
}
