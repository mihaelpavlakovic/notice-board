import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../database/firebase";

export const uploadFiles = createAsyncThunk("post/uploadFiles", async file => {
  try {
    const storageRef = ref(storage, `postFiles/${file.name}`);
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

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI) => {
    try {
      console.log(data);
      // Upload the files to Firebase Storage
      // const downloadURL = await thunkAPI.dispatch(uploadImage(profilePicture));
    } catch (error) {
      throw error;
    }
  }
);
