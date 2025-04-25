import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginCredentials, UserState, AuthState } from "../types";

const apiUrl = process.env.API_URL;

const initialState: UserState = {
  user: null,
  //
  token: null,
  isAuthenticated: false,
};

// https://redux-toolkit.js.org/rtk-query/usage/examples#authentication
export const authUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }: LoginCredentials, thunkAPI) => {
    try {
      console.log("loginUser::", email, password, apiUrl);

      const login = await loginUser({ email, password });
      console.log("login::", login.token);

      if (!login.token) {
        return thunkAPI.rejectWithValue("Token is null");
      }

      const user = await getUser(login.token);
      console.log("user::", user);

      return { token: login.token, user }; // ex : body: { user, token } ...
    } catch (error) {
      // debugger;
      return thunkAPI.rejectWithValue((error as Error)?.message);
    }
  }
);

const loginUser = async ({
  email,
  password,
}: LoginCredentials): Promise<AuthState> => {
  const response = await fetch(`${apiUrl}/api/v1/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // Gerer les erreurs de connexion 400 / 500
  if (!response.ok) {
    throw new Error("Erreur lors de la connexion");
  }
  let data = await response.json();
  return data.body;
};

const getUser = async (token: string): Promise<UserState> => {
  const response = await fetch(`${apiUrl}/api/v1/user/profile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la connexion");
  }

  let data = await response.json();
  return data.body;
};

// A slice manages user state with initial state, reducers, and actions.
const userActions = createSlice({
  name: "user",
  initialState,
  // // An object of "case reducers". Key names will be used to generate actions.
  // reducers: Record<string, ReducerFunction | ReducerAndPrepareObject>,
  reducers: {
    /*
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    */
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action: PayloadAction<UserState>) => {
      if (!state.user) return state;
      state.user.firstName = action.payload.user?.firstName || "";
      state.user.lastName = action.payload.user?.lastName || "";
      state.user.email = action.payload.user?.email || "";
    },
  },
  // Documentation: https://redux-toolkit.js.org/api/createSlice#handling-asynchronous-logic
  // // A "builder callback" function used to add more reducers
  // extraReducers?: (builder: ActionReducerMapBuilder<State>) => void,
  extraReducers: (builder) => {
    builder
      .addCase(authUser.fulfilled, (state, action) => {
        console.log(
          "payload::",
          action.payload,
          action.payload.user?.firstName
        );

        state.token = action.payload.token;
        // userActions.caseReducers.login(state, {
        //   payload: { token: action.payload.token },
        //   type: "user/login",
        // });

        state.user = {
          firstName: action.payload.user?.firstName,
          lastName: action.payload.user.lastName,
          email: action.payload.user.email,
        };
        state.isAuthenticated = true;
      })
      .addCase(authUser.rejected, (state, action) => {
        console.error("Erreur de login: rejected", action.payload);
        state = initialState;
      });
  },
});

export const { login, logout, updateProfile } = userActions.actions;
export default userActions.reducer;
