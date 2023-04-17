import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import postReducer from "./post/postSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
});
