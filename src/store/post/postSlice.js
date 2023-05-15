import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  uploadFiles,
  fetchPosts,
  deletePost,
  createComment,
  deleteComment,
  updateComment,
} from "./postActions";

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
        console.log(error);
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(createComment.pending, state => {
        state.status = "loading";
      })
      .addCase(createComment.fulfilled, state => {
        state.status = "succeeded";
      })
      .addCase(createComment.rejected, (state, { error }) => {
        state.status = "failed";
        console.log(error);
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(updateComment.pending, state => {
        state.status = "loading";
      })
      .addCase(updateComment.fulfilled, state => {
        state.status = "succeeded";
      })
      .addCase(updateComment.rejected, (state, { error }) => {
        state.status = "failed";
        console.log(error);
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(fetchPosts.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.posts = payload;
      })
      .addCase(fetchPosts.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
      })
      .addCase(deletePost.fulfilled, (state, { payload }) => {
        state.posts = state.posts.filter(post => post.id !== payload);
      })
      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
      });
  },
});

export const selectPosts = state => state.post.posts;
export const selectStatus = state => state.post.status;
export const selectIsLoading = state => state.post.isLoading;
export const selectError = state => state.post.error;

// export const { some_actions } = postSlice.actions;

export default postSlice.reducer;
