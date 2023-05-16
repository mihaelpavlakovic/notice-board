import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserById,
  listenAuthState,
  login,
  logout,
  register,
  updateProfileInfo,
  updateProfilePicture,
  uploadImage,
} from "./userActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userData: null,
    status: "idle",
    isLoading: true,
    error: {
      errorCode: "",
      errorMessage: "",
    },
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, state => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = payload;
        state.error.errorCode = "";
        state.error.errorMessage = "";
      })
      .addCase(login.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(register.pending, state => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = payload;
        state.error.errorCode = "";
        state.error.errorMessage = "";
      })
      .addCase(register.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(uploadImage.pending, state => {
        state.status = "loading";
      })
      .addCase(uploadImage.fulfilled, state => {
        state.status = "succeeded";
        state.error.errorCode = "";
        state.error.errorMessage = "";
      })
      .addCase(uploadImage.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(logout.pending, state => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, state => {
        state.status = "succeeded";
        state.user = null;
        state.userData = null;
        state.error.errorCode = "";
        state.error.errorMessage = "";
      })
      .addCase(logout.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(listenAuthState.pending, state => {
        state.status = "loading";
      })
      .addCase(listenAuthState.fulfilled, state => {
        state.status = "succeeded";
      })
      .addCase(listenAuthState.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(fetchUserById.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.userData = payload;
      })
      .addCase(fetchUserById.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(updateProfilePicture.pending, state => {
        state.status = "loading";
      })
      .addCase(updateProfilePicture.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.userData.photoURL = payload;
      })
      .addCase(updateProfilePicture.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(updateProfileInfo.pending, state => {
        state.status = "loading";
      })
      .addCase(updateProfileInfo.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.userData.displayName = payload;
      })
      .addCase(updateProfileInfo.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      });
  },
});

export const selectUser = state => state.user.user;
export const selectUserData = state => state.user.userData;
export const selectStatus = state => state.user.status;
export const selectError = state => state.user.error;
export const selectIsLoading = state => state.user.isLoading;

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
