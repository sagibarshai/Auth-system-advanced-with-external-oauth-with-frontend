import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
