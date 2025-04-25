export interface UserState {
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    //
    createdAt?: string;
    id?: string;
    updatedAt?: string;
  } | null;
  //
  token?: string | null;
  isAuthenticated?: Boolean;
}
