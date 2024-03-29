import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserById,
  listenAuthState,
  login,
  logout,
  register,
  resetPassword,
  updateProfileInfo,
  updateProfilePicture,
  uploadImage,
  deleteUser,
} from './userActions';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    userData: null,
    status: 'idle',
    isLoading: true,
    hasError: false,
    progress: 0,
    emailSent: false,
    error: {
      errorCode: '',
      errorMessage: '',
    },
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.user = payload;
      state.isLoading = false;
    },
    updateUploadProgress: (state, { payload }) => {
      state.progress = payload;
    },
    resetUploadProgress: (state) => {
      state.progress = 0;
    },
    updateEmailSent: (state) => {
      state.emailSent = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
        state.error.errorCode = '';
        state.error.errorMessage = '';
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.user = payload;
        state.error.errorCode = '';
        state.error.errorMessage = '';
      })
      .addCase(login.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        console.log(error);
        if (error.message.includes('wrong')) {
          state.error.errorCode = error.code;
          state.error.errorMessage = 'Pogrešna lozinka. Pokušajte ponovo!';
        } else if (error.message.includes('user-not-found')) {
          state.error.errorCode = error.code;
          state.error.errorMessage =
            'Korisnik nije pronađen, provjerite ispravnost upisanog maila.';
        } else {
          state.error.errorCode = error.code;
          state.error.errorMessage = error.message;
        }
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.userData = payload;
        state.error.errorCode = '';
        state.error.errorMessage = '';
      })
      .addCase(register.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        if (error.message.includes('email-already-in-use')) {
          state.error.errorCode = error.code;
          state.error.errorMessage = 'Korisnički račun sa ovim mailom već postoji.';
        } else {
          state.error.errorCode = error.code;
          state.error.errorMessage = error.message;
        }
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.error.errorCode = '';
        state.error.errorMessage = '';
      })
      .addCase(resetPassword.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        console.log(error);
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(uploadImage.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.error.errorCode = '';
        state.error.errorMessage = '';
      })
      .addCase(uploadImage.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.hasError = false;
        state.user = null;
        state.userData = null;
        state.error.errorCode = '';
        state.error.errorMessage = '';
        state.status = 'succeeded';
      })
      .addCase(logout.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(listenAuthState.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(listenAuthState.fulfilled, (state) => {
        state.status = 'succeeded';
        state.hasError = false;
      })
      .addCase(listenAuthState.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(fetchUserById.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.userData = payload;
      })
      .addCase(fetchUserById.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(updateProfilePicture.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.userData.photoURL = payload;
      })
      .addCase(updateProfilePicture.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(updateProfileInfo.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(updateProfileInfo.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.hasError = false;
        state.userData.displayName = payload;
      })
      .addCase(updateProfileInfo.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.hasError = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.hasError = false;
      })
      .addCase(deleteUser.rejected, (state, { error }) => {
        state.status = 'failed';
        state.hasError = true;
        state.error.errorCode = error.code;
        state.error.errorMessage = error.message;
      });
  },
});

export const selectUser = (state) => state.user.user;
export const selectUserData = (state) => state.user.userData;
export const selectStatus = (state) => state.user.status;
export const selectHasError = (state) => state.user.hasError;
export const selectError = (state) => state.user.error;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectProgress = (state) => state.user.progress;
export const selectEmailSent = (state) => state.user.emailSent;

export const { setCurrentUser, updateUploadProgress, resetUploadProgress, updateEmailSent } =
  userSlice.actions;

export default userSlice.reducer;
