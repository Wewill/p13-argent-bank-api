import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
const rootReducer = combineReducers({});
export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

export default store;
