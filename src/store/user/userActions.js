// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// firebase imports
import { auth, storage } from "../../database/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const register = createAsyncThunk(
  "user/register",
  async ({ email, password, name, profilePicture }, thunkAPI) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Upload the photo to Firebase Storage
      const downloadURL = await thunkAPI.dispatch(uploadImage(profilePicture));

      // Update the user's display name and photo URL
      await updateProfile(user, {
        displayName: name,
        photoURL: downloadURL.payload,
      });

      return JSON.stringify(user);
    } catch (error) {
      throw error;
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      return JSON.stringify(user);
    } catch (error) {
      throw error;
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
});

export const uploadImage = createAsyncThunk("user/uploadImage", async file => {
  try {
    const storageRef = ref(storage, `profilePictures/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    let snapshot;

    uploadTask.on(
      "state_changed",
      snap => {
        snapshot = snap;
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      error => {
        throw error;
      },
      () => {
        // Upload completed successfully, now get download URL
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          return downloadURL;
        });
      }
    );

    // Return a promise that resolves with the download URL
    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", null, reject, () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(downloadURL => {
            resolve(downloadURL);
          })
          .catch(reject);
      });
    });
  } catch (error) {
    throw error;
  }
});
