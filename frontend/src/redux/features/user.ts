import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SafeUser } from "../../api/backend/auth/types";

type UserState = SafeUser | null;

const initialState: UserState | null = null as UserState;

export const userSlice = createSlice({
  name: "user-slice",
  initialState,
  reducers: {
    setUser: (state: SafeUser | null, action: PayloadAction<SafeUser | null>) => {
      return action.payload;
    },
    clearUser: (state: SafeUser | null): null => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
