import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

export default store;
