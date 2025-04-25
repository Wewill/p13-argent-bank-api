export interface UserState {
  user: {
    firstName: string;
    lastName: string;
    email?: string;
  } | null;
  //
  token?: string | null;
  isAuthenticated?: Boolean;
}
