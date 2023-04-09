import { createSlice } from "@reduxjs/toolkit";
import { login, logout, register, uploadImage } from "./userActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userData: null,
    status: "idle",
    error: {
      errorCode: "",
      errorMessage: "",
    },
  },
  reducers: {},
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
      });
  },
});

export const selectUser = state => state.user.user;
export const selectStatus = state => state.user.status;
export const selectError = state => state.user.error;

export const { setData } = userSlice.actions;

export default userSlice.reducer;
