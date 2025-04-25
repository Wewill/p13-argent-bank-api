import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
const apiUrl = process.env.API_URL;

const initialState = {
  firstName: "",
  lastName: "",
  token: null,
  isAuthenticated: false,
  // ...
} satisfies userState as userState;

interface userState {
  firstName: string;
  lastName: string;
  token: string | null;
  isAuthenticated: Boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// https://redux-toolkit.js.org/rtk-query/usage/examples#authentication
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }: LoginCredentials, thunkAPI) => {
    try {
      console.log("loginUser::", email, password, apiUrl);
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

      const data = await response.json();
      return data.body; // ex : body: { user, token } ...
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error)?.message);
    }
  }
);

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
    setProfile: (state, action: PayloadAction<userState>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      //...
    },
    updateProfile: (state, action: PayloadAction<userState>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      //...
    },
  },
  // Documentation: https://redux-toolkit.js.org/api/createSlice#handling-asynchronous-logic
  // // A "builder callback" function used to add more reducers
  // extraReducers?: (builder: ActionReducerMapBuilder<State>) => void,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("Erreur de login:", action.payload);
      });
  },
});

export const { login, logout, setProfile, updateProfile } = userActions.actions;
export default userActions.reducer;
