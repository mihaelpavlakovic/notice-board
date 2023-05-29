// react imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// firebase imports
import { auth, db, storage } from "../../database/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setCurrentUser, updateEmailSent } from "./userSlice";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateUploadProgress } from "./userSlice";

export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  async (fileData, thunkAPI) => {
    const { profilePicture, userId } = fileData;
    try {
      const fileExtension = profilePicture.name.split(".").pop();
      const fileName = `${userId}.${fileExtension}`;
      const storageRef = ref(storage, `profilePictures/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);

      // Create a promise that resolves with the download URL
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            thunkAPI.dispatch(updateUploadProgress(progress));
          },
          error => {
            reject(error);
          },
          () => {
            // Upload completed successfully, now get download URL
            getDownloadURL(uploadTask.snapshot.ref)
              .then(downloadURL => {
                resolve(downloadURL);
              })
              .catch(error => {
                reject(error);
              });
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }
);

export const listenAuthState = createAsyncThunk(
  "user/listenAuthState",
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(setCurrentUser(JSON.stringify(user)));
        dispatch(fetchUserById(user.uid));
      } else {
        dispatch(setCurrentUser(null));
      }
    });
  }
);

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
      const downloadURL = await thunkAPI.dispatch(
        uploadImage({ profilePicture, userId: user.uid })
      );

      // Update the user's display name and photo URL
      await updateProfile(user, {
        displayName: name,
        photoURL: downloadURL.payload,
      });

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        displayName: name,
        email: email,
        isAdmin: false,
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

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (email, thunkAPI) => {
    try {
      await sendPasswordResetEmail(auth, email).then(() => {
        thunkAPI.dispatch(updateEmailSent());
      });
    } catch (error) {
      throw error;
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async userId => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        return userDocSnapshot.data();
      } else {
        throw new Error(`User with ID ${userId} does not exist`);
      }
    } catch (error) {
      throw error;
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (profilePicture, thunkAPI) => {
    try {
      const user = auth.currentUser;

      // Upload the photo to Firebase Storage
      const downloadURL = await thunkAPI.dispatch(
        uploadImage({ profilePicture, userId: user.uid })
      );

      await updateProfile(user, {
        photoURL: downloadURL.payload,
      });

      // Update the profile picture URL in the users collection
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL.payload,
      });

      return downloadURL.payload;
    } catch (error) {
      throw error;
    }
  }
);

export const updateProfileInfo = createAsyncThunk(
  "user/updateProfileInfo",
  async (displayName, thunkAPI) => {
    try {
      // Get the currently logged-in user
      const user = auth.currentUser;

      // Update the display name in the Firebase Authentication user profile
      await updateProfile(user, {
        displayName: displayName,
      });

      // Update the display name in the users collection
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
      });

      return displayName;
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
