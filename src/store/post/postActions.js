import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, db, storage } from "../../database/firebase";
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
import { updateUploadProgress } from "./postSlice";

const { v4: uuidv4 } = require("uuid");

export function generateId() {
  return uuidv4();
}

export const uploadFiles = createAsyncThunk(
  "post/uploadFiles",
  async ({ files, documentId }, thunkAPI) => {
    try {
      const totalBytes = files.reduce((total, file) => total + file.size, 0);

      const uploadTasks = files.map(file => {
        const storageRef = ref(storage, `postFiles/${documentId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return uploadTask;
      });

      const promises = uploadTasks.map(uploadTask => {
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            snapshot => {
              const bytesTransferred = snapshot.bytesTransferred;
              const progress = (bytesTransferred / totalBytes) * 100;
              // console.log(`Upload is ${progress}% done`);

              thunkAPI.dispatch(updateUploadProgress(progress));
            },
            reject,
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then(downloadURL => {
                  const file = {
                    downloadURL,
                    documentName: uploadTask.snapshot.ref.name,
                  };
                  resolve(file);
                })
                .catch(reject);
            }
          );
        });
      });

      const downloadURLs = await Promise.all(promises);
      thunkAPI.dispatch(updateUploadProgress(100));
      return downloadURLs;
    } catch (error) {
      throw error;
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI) => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      const documentId = generateId();
      let downloadURLs = [];
      let postData = {};

      if (data.files.length > 0) {
        const files = Array.isArray(data.files)
          ? data.files
          : Object.values(data.files);

        const uploadTask = thunkAPI.dispatch(
          uploadFiles({ files, documentId })
        );

        const uploadResult = await uploadTask;

        if (uploadResult.payload) {
          downloadURLs = uploadResult.payload.map(file => {
            const { downloadURL, documentName } = file;
            return { downloadURL, documentName };
          });
        }
      }

      if (data.pollOptions.length > 0) {
        postData = {
          title: data.postTitle,
          text: data.postText,
          createdAt: Timestamp.fromDate(new Date()).toDate(),
          documentId: data.files.length > 0 ? documentId : "",
          files: downloadURLs,
          user: userRef,
          pollOptions: data.pollOptions,
          totalVotedUsers: [],
        };
      } else {
        postData = {
          title: data.postTitle,
          text: data.postText,
          createdAt: Timestamp.fromDate(new Date()).toDate(),
          documentId: data.files.length > 0 ? documentId : "",
          files: downloadURLs,
          user: userRef,
        };
      }

      await addDoc(collection(db, "posts"), postData);
    } catch (error) {
      throw error;
    }
  }
);

export const handleVote = createAsyncThunk(
  "post/handleVote",
  async ({ postId, optionIndex }, thunkAPI) => {
    try {
      const userId = auth.currentUser.uid;
      const state = thunkAPI.getState();
      const { posts } = state.post;

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          // Check if the user has already voted in the poll
          if (!post.totalVotedUsers.includes(userId)) {
            const pollOptions = post.pollOptions.map((option, index) => {
              if (index === optionIndex) {
                return {
                  ...option,
                  votes: option.votes + 1,
                  votedUsers: [...option.votedUsers, userId],
                };
              }
              return option;
            });

            const totalVotedUsers = [...post.totalVotedUsers, userId];

            return {
              ...post,
              pollOptions,
              totalVotedUsers,
            };
          }
        }
        return post;
      });

      const updatedPost = updatedPosts.find(post => post.id === postId);

      // Perform the necessary database update if required
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        pollOptions: updatedPost.pollOptions,
        totalVotedUsers: updatedPost.totalVotedUsers,
      });

      return {
        postId,
        pollOptions: updatedPost.pollOptions,
        totalVotedUsers: updatedPost.totalVotedUsers,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (postData, thunkAPI) => {
    try {
      const { postId, title, text, files, documentId } = postData;

      const postRef = doc(db, "posts", postId);

      const postSnapshot = await getDoc(postRef);
      const docData = postSnapshot.data();
      const currentFiles = docData.files || [];
      const existingDocumentId = docData.documentId;

      const updatedFiles = [...currentFiles, ...files];

      const updates = {
        title: title,
        text: text,
        files: updatedFiles,
        documentId: existingDocumentId ? existingDocumentId : documentId,
      };

      await updateDoc(postRef, updates);

      return {
        postId: postId,
        title: title,
        text: text,
        files: updatedFiles,
        documentId,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "post/deleteDocument",
  async ({ postId, documentId, index, filename }, thunkAPI) => {
    try {
      // Construct the file path using the documentId and filename
      const filePath = `postFiles/${documentId}/${filename}`;

      // Delete the file from Firebase Storage
      await deleteObject(ref(storage, filePath));

      // Remove the reference to the document from the specific document
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();
      await updateDoc(postRef, {
        files: arrayRemove(postData.files[index]),
      });

      return { postId, index };
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
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
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

      return {
        postId,
        comment,
        user: thunkAPI.getState().user.userData,
      };
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

      const docRef = doc(db, "posts", postId);
      const commentForChange = await getDoc(docRef).then(
        doc => doc.data().comments
      );
      let updatedComments = [];

      commentForChange.forEach(comment => {
        updatedComments.push({
          ...comment,
        });
      });
      updatedComments[commentId].value = commentValue;

      await updateDoc(docRef, {
        comments: updatedComments,
      });

      return { postId, commentId, commentValue };
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
          comment.createdAt = comment.createdAt.toDate().toLocaleString();
        }

        post.createdAt = post.createdAt.toDate().toLocaleString();

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
      const postDoc = await getDoc(postDocRef);
      const postData = postDoc.data();

      // Check if there are links to Firestore documents in the post
      if (postData && postData.files && postData.files.length > 0) {
        const fileDeletionPromises = postData.files.map(async file => {
          // Delete the file from Firebase Storage
          const fileStorageRef = ref(storage, file.downloadURL);
          await deleteObject(fileStorageRef);
        });

        // Wait for all file deletions to complete
        await Promise.all(fileDeletionPromises);
      }
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

      // Remove the comment from the specific post document
      const docRef = doc(db, "posts", postId);
      const comForDelete = await getDoc(docRef).then(doc => doc.data());

      await updateDoc(doc(db, "posts", postId), {
        comments: arrayRemove(comForDelete.comments[commentId]),
      });

      return { postId, commentId };
    } catch (error) {
      throw error;
    }
  }
);
