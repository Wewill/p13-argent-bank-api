const apiUrl = process.env.API_URL;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginCredentials, UserState, AuthState, User } from "../types";
import { loginUserFetch, getUserFetch, setUserFetch } from "./fetch";

import type { RootState } from "./store";

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
  error: null,
  status: "idle",
};

// Async actions
// https://redux-toolkit.js.org/rtk-query/usage/examples#authentication
export const authUser = createAsyncThunk(
  "user/authUser",
  async ({ email, password }: LoginCredentials, thunkAPI) => {
    // thunkAPI.dispatch(updateStatus("loading")); // example : dispatch an action inside a thunk
    try {
      const login = await loginUserFetch({ email, password });
      if (!login.token) {
        // throw new Error("Token is null");
        return thunkAPI.rejectWithValue("Auth error : Token is null");
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
    try {
      // Get token from state
      const state = thunkAPI.getState() as RootState;
      const { token } = state.user ?? null;

      const data = await getUserFetch(token);
      if (!data) {
        // throw new Error("Token is null");
        return thunkAPI.rejectWithValue("User data is null");
      }
      return { user: data };
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
  async (newUser: User, thunkAPI) => {
    try {
      // Get token from state
      const state = thunkAPI.getState() as RootState;
      const { token } = state.user ?? null;

      const data = await setUserFetch(token, newUser);
      if (!data) {
        // throw new Error("Token is null");
        return thunkAPI.rejectWithValue("User data is null");
      }
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
    login: (state, action: PayloadAction<AuthState>) => {
      console.log("login::", action.payload);
      document.cookie = `api_token=${action.payload.token}; path=/; max-age=3600`;
      state.token = action.payload.token;
      return { ...state, status: "authenticated" }; // Go back to initialState object
    },
    logout: (state) => {
      console.log("logout::");
      document.cookie = "api_token=null; path=/; max-age=0";
      return { ...initialState, token: null, error: state.error }; // Go back to initialState object
    },
    updateProfile: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    updateError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateStatus: (state, action: PayloadAction<string | null>) => {
      state.status = action.payload;
    },
  },
  // Documentation: https://redux-toolkit.js.org/api/createSlice#handling-asynchronous-logic
  // A "builder callback" function used to add more reducers
  extraReducers: (builder) => {
    builder
      // authUser
      .addCase(authUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.status = "success";
        userActions.caseReducers.login(state, {
          payload: { token: action.payload.token as string },
          type: "user/login",
        });
      })
      .addCase(authUser.rejected, (state, action) => {
        state.status = "error";
        userActions.caseReducers.updateError(state, {
          payload: action.payload as string,
          type: "user/updateError",
        });
      })
      // getUser
      .addCase(getUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "success";
        userActions.caseReducers.updateProfile(state, {
          payload: action.payload?.user ?? null,
          type: "user/updateProfile",
        });
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "error";
        userActions.caseReducers.updateError(state, {
          payload: action.payload as string,
          type: "user/updateError",
        });
      })
      // putUser
      .addCase(putUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(putUser.fulfilled, (state, action) => {
        state.status = "success";
        userActions.caseReducers.updateProfile(state, {
          payload: action.payload?.user ?? null,
          type: "user/updateProfile",
        });
      })
      .addCase(putUser.rejected, (state, action) => {
        state.status = "error";
        userActions.caseReducers.updateError(state, {
          payload: action.payload as string,
          type: "user/updateError",
        });
      });
  },
});

export const { login, logout, updateProfile, updateError, updateStatus } =
  userActions.actions;
export default userActions.reducer;
