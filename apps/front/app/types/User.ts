export interface UserState {
  user: User | null;
  //
  token?: string | null;
  error?: string | null;
  status?: string | null;
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
