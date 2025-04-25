import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  token: null,
  isAuthenticated: false,
  // ...
};

const apiUrl = process.env.API_URL;

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la connexion");
      }

      const data = await response.json();
      return data.body; // body: { token }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A slice manages user state with initial state, reducers, and actions.
const userActions = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    setProfile: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      //...
    },
    updateProfile: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      //...
    },
  },
});

export const { login, logout, setProfile, updateProfile } = userActions.actions;

export default userActions.reducer;
