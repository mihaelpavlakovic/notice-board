import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  uploadFiles,
  fetchPosts,
  deletePost,
  createComment,
  deleteComment,
  updateComment,
  updatePost,
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
      .addCase(createComment.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        const { postId, comment } = payload;
        const post = state.posts.find(post => post.id === postId);

        post.comments.push(comment);
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
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        const { postId, commentId, commentValue } = payload;
        const post = state.posts.find(post => post.id === postId);

        post.comments[commentId].value = commentValue;
      })
      .addCase(updateComment.rejected, (state, { error }) => {
        state.status = "failed";
        console.log(error);
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(updatePost.pending, state => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        const { postId, title, text } = payload;
        const post = state.posts.find(post => post.id === postId);

        post.title = title;
        post.text = text;
      })
      .addCase(updatePost.rejected, (state, { error }) => {
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
        state.status = "succeeded";
        state.posts = state.posts.filter(post => post.id !== payload);
      })
      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        const { postId, commentId } = payload;
        const post = state.posts.find(post => post.id === postId);

        post.comments.splice(commentId, 1);
      });
  },
});

export const selectPosts = state => state.post.posts;
export const selectStatus = state => state.post.status;
export const selectIsLoading = state => state.post.isLoading;
export const selectError = state => state.post.error;

// export const { some_actions } = postSlice.actions;

export default postSlice.reducer;
