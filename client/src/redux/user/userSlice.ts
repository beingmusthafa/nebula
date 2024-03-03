import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  cartCount: null,
  wishlistCount: null,
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
      state.cartCount = null;
      state.wishlistCount = null;
    },
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
    setWishlistCount(state, action) {
      state.wishlistCount = action.payload;
    },
  },
});

export const {
  signIn,
  signOut,
  updateDetails,
  setCartCount,
  setWishlistCount,
} = userSlice.actions;
export default userSlice.reducer;
