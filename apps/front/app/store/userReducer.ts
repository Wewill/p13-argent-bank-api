const apiUrl = process.env.API_URL;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginCredentials, UserState, AuthState, User } from "../types";
import { loginUserFetch, getUserFetch, setUserFetch } from "./fetch";

import type { RootState } from "./store";

import type { useNavigate, useLocation } from "react-router";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";

const initialState: UserState = {
  user: null,
  //
  token:
    (typeof document !== "undefined" &&
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("api_token="))
        ?.split("=")[1]) ||
    null,
  isAuthenticated: false,
  error: null,
  redirectTo: null,
};

// Async actions
// https://redux-toolkit.js.org/rtk-query/usage/examples#authentication
export const authUser = createAsyncThunk(
  "user/authUser",
  async ({ email, password }: LoginCredentials, thunkAPI) => {
    try {
      console.log("authUser::", email, password, apiUrl);

      const login = await loginUserFetch({ email, password });
      console.log("get token::", login.token);

      if (!login.token) {
        console.error("authUser::error", "Token is null");
        // throw new Error("Token is null");
        return thunkAPI.rejectWithValue("Token is null");
      }

      return { token: login.token };
    } catch (error) {
      // debugger;
      console.error("authUser::error", error, (error as Error)?.message);
      // throw new Error("Auth error");
      return thunkAPI.rejectWithValue(
        (error as Error)?.message || "Auth error"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (undefined, thunkAPI) => {
    console.log("getUser::getUser", apiUrl, thunkAPI);

    try {
      console.log("getUser::", apiUrl, thunkAPI);

      // Get token from state
      const state = thunkAPI.getState() as RootState;
      const { token } = state.user ?? null;

      const user = await getUserFetch(token);
      console.log("get user::", user);

      if (!user) {
        console.error("getUser::error", "User is null");
        // throw new Error("Token is null");
        return thunkAPI.rejectWithValue("User is null");
      }

      return { user: user };
    } catch (error) {
      // debugger;
      console.error("getUser::error", error, (error as Error)?.message);
      // throw new Error("Get user error");
      return thunkAPI.rejectWithValue(
        (error as Error)?.message || "Get user error"
      );
    }
  }
);

export const putUser = createAsyncThunk(
  "user/putUser",
  async (newUser: UserState, thunkAPI) => {
    try {
      console.log("putUser::", newUser, apiUrl, thunkAPI);

      // Get token from state
      const state = thunkAPI.getState() as RootState;
      const { token } = state.user ?? null;

      const data = await setUserFetch(token, newUser);
      console.log("put user::result data", data);

      return { user: data }; // ex : body: { user, token } ...
    } catch (error) {
      // debugger;
      console.error("putUser::error", error, (error as Error)?.message);
      // throw new Error("Set user error");
      return thunkAPI.rejectWithValue(
        (error as Error)?.message || "Save user error"
      );
    }
  }
);

// A slice manages user state with initial state, reducers, and actions.
const userActions = createSlice({
  name: "user",
  initialState,
  // An object of "case reducers". Key names will be used to generate actions.
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
      console.log("login::");
      document.cookie = `api_token=${action.payload.token}; path=/; max-age=3600`;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      console.log("logout::");
      document.cookie = "api_token=null; path=/; max-age=0";
      // Go back to initialState object
      // Object.assign(state, initialState);
      // Better practice
      return { ...initialState };
    },
    // Updated initProfile reducer to accept location and navigate as arguments
    initProfile: (
      state,
      action: PayloadAction<{
        location: ReturnType<typeof useLocation>;
      }>
    ) => {
      let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch
      const { location } = action.payload || {};
      console.log("initProfile::", location);
      if (!state.token) state.redirectTo = "/login";
      if (state.token && !state.user?.id) {
        console.log(
          "initProfile:: We have a token, but no user, we can get the user"
        );
        //getUser();
        dispatch(getUser());
        if (location.pathname === "/login") state.redirectTo = "/profile";
      }
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      console.log("updateProfile::", action.payload);
      state.user = action.payload;
    },
    updateError: (state, action: PayloadAction<string | null>) => {
      console.error("updateError::", action.payload);
      state.error = action.payload;
    },
    updateRedirectTo: (state, action: PayloadAction<string | null>) => {
      console.log("updateRedirectTo::", action.payload);
      state.redirectTo = action.payload;
    },
  },
  // Documentation: https://redux-toolkit.js.org/api/createSlice#handling-asynchronous-logic
  // A "builder callback" function used to add more reducers
  extraReducers: (builder) => {
    builder
      .addCase(authUser.fulfilled, (state, action) => {
        // Login
        userActions.caseReducers.login(state, {
          payload: { token: action.payload.token as string },
          type: "user/login",
        });
      })
      .addCase(authUser.rejected, (state, action) => {
        console.error("Erreur de login: rejected", action.payload);
        userActions.caseReducers.updateError(state, {
          payload: action.payload as string,
          type: "user/updateError",
        });
      })
      .addCase(getUser.fulfilled, (state, action) => {
        // User
        userActions.caseReducers.updateProfile(state, {
          payload: action.payload.user,
          type: "user/updateProfile",
        });
      })
      .addCase(getUser.rejected, (state, action) => {
        console.error("Erreur de l'api: rejected", action.payload);
        userActions.caseReducers.updateError(state, {
          payload: action.payload as string,
          type: "user/updateError",
        });
      });
  },
});

export const {
  login,
  logout,
  initProfile,
  updateProfile,
  updateError,
  updateRedirectTo,
} = userActions.actions;
export default userActions.reducer;
