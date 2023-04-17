import { createSlice } from "@reduxjs/toolkit";
import { createPost, uploadFiles } from "./postActions";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: null,
    status: "idle",
    isLoading: true,
    error: {
      errorCode: "",
      errorMessage: "",
    },
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(uploadFiles.pending, state => {
        state.status = "loading";
      })
      .addCase(uploadFiles.fulfilled, state => {
        state.status = "succeeded";
      })
      .addCase(uploadFiles.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(createPost.pending, state => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, state => {
        state.status = "succeeded";
      })
      .addCase(createPost.rejected, (state, { error }) => {
        state.status = "failed";
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      });
  },
});

export const selectPosts = state => state.post.posts;
export const selectStatus = state => state.post.status;
export const selectIsLoading = state => state.post.isLoading;
export const selectError = state => state.post.error;

// export const { some_actions } = postSlice.actions;

export default postSlice.reducer;
