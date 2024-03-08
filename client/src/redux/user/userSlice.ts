import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn(state, action) {
      state.currentUser = action.payload;
    },
    updateDetails(state, action) {
      state.currentUser = action.payload;
    },
    signOut(state) {
      state.currentUser = null;
    },
  },
});

export const { signIn, signOut, updateDetails } = userSlice.actions;
export default userSlice.reducer;
