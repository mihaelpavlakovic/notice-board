import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../database/firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

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
      const userRef = doc(db, "users", thunkAPI.getState().user.userData.uid);
      let downloadURLs = [];
      console.log(data.files);
      if (data.files.length > 0) {
        const files = Array.isArray(data.files)
          ? data.files
          : Object.values(data.files);

        for (const file of files) {
          const downloadURL = await thunkAPI.dispatch(uploadFiles(file));
          console.log("downloadURL:", downloadURL);
          downloadURLs.push({
            downloadURL: downloadURL.payload,
            documentName: downloadURL.meta.arg.name,
          });
        }
      }
      const postData = {
        title: data.postTitle,
        text: data.postText,
        createdAt: Timestamp.fromDate(new Date()).toDate(),
        files: downloadURLs,
        user: userRef,
      };
      // Upload the files to Firebase Storage
      console.log(postData);
      addDoc(collection(db, "posts"), postData);
    } catch (error) {
      throw error;
    }
  }
);

export const createComment = createAsyncThunk(
  "post/createComment",
  async (commentData, thunkAPI) => {
    try {
      // Extract the necessary data from commentData
      const { postId, commentValue } = commentData;
      const userRef = doc(db, "users", thunkAPI.getState().user.userData.uid);
      // Create a new comment object
      const comment = {
        value: commentValue,
        user: userRef,
        createdAt: Timestamp.fromDate(new Date()).toDate(),
      };

      // Add the comment to the specific post document
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion(comment),
      });
    } catch (error) {
      throw error;
    }
  }
);

export const updateComment = createAsyncThunk(
  "post/updateComment",
  async (commentData, thunkAPI) => {
    try {
      // Extract the necessary data from commentData
      const { postId, commentId, commentValue } = commentData;

      // Update the comment value in the specific post document
      await updateDoc(doc(db, "posts", postId, "comments", commentId), {
        value: commentValue,
      });

      // return { commentId, commentValue };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const postsCollectionRef = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const postsSnapshot = await getDocs(postsCollectionRef);
      const posts = [];

      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();
        let post = {
          id: postDoc.id,
          ...postData,
          user: null, // Add a null user field to the post initially
          comments: [], // Initialize an empty array to store comments
        };

        const userRef = doc(db, postData.user.path); // Assuming user field is a reference

        // Fetch user data by following the reference
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          post.user = userDoc.data();
        }

        // Fetch comments and their associated users
        const comments = postData.comments || []; // Check if comments exist in the data
        for (const comment of comments) {
          const commentUserRef = doc(db, comment.user.path); // Assuming user field is a reference

          const commentUserDoc = await getDoc(commentUserRef);
          if (commentUserDoc.exists()) {
            comment.user = commentUserDoc.data();
          }
        }

        post.comments = comments; // Update the post's comments array with fetched data
        posts.push(post);
      }

      return posts;
    } catch (error) {
      throw error;
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkAPI) => {
    try {
      const postDocRef = doc(db, "posts", postId);
      await deleteDoc(postDocRef);
      return postId;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (commentData, thunkAPI) => {
    try {
      // Extract the necessary data from commentData
      const { postId, commentId } = commentData;
      console.log(postId, commentId);
      // Remove the comment from the specific post document
      const docRef = await doc(db, "posts", postId);
      const comForDelete = await getDoc(docRef).then(doc => doc.data());

      await updateDoc(doc(db, "posts", postId), {
        comments: arrayRemove(comForDelete.comments[commentId]),
      });
    } catch (error) {
      throw error;
    }
  }
);
