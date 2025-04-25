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
      console.log("authUser::", email, password, apiUrl);

      const login = await loginUser({ email, password });
      console.log("get token::", login.token);

      if (!login.token) {
        return thunkAPI.rejectWithValue("Token is null");
      }

      const user = await getUser(login.token);
      console.log("get user::", user);

      return { token: login.token, user: user }; // ex : body: { user, token } ...
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
    login: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      console.log("logout::", state.token);
      state = initialState;
      console.log("logout:: AFTER", state.token);
    },
    updateProfile: (state, action: PayloadAction<UserState>) => {
      console.log(
        "updateProfile::",
        action.payload,
        action.payload.user?.firstName,
        action.payload.user
      );

      state.user = action.payload.user;
    },
  },
  // Documentation: https://redux-toolkit.js.org/api/createSlice#handling-asynchronous-logic
  // // A "builder callback" function used to add more reducers
  // extraReducers?: (builder: ActionReducerMapBuilder<State>) => void,
  extraReducers: (builder) => {
    builder
      .addCase(authUser.fulfilled, (state, action) => {
        // Login
        userActions.caseReducers.login(state, {
          payload: { token: action.payload.token },
          type: "user/login",
        });
        // Update
        userActions.caseReducers.updateProfile(state, {
          payload: { user: { ...action.payload.user } },
          type: "user/updateProfile",
        });
      })
      .addCase(authUser.rejected, (state, action) => {
        console.error("Erreur de login: rejected", action.payload);
        state = initialState;
      });
  },
});

export const { login, logout, updateProfile } = userActions.actions;
export default userActions.reducer;
