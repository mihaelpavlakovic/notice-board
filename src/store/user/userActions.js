// react imports
import { createAsyncThunk } from '@reduxjs/toolkit';

// firebase imports
import { auth, db, storage } from '../../database/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { setCurrentUser, updateEmailSent } from './userSlice';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  refEqual,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { updateUploadProgress } from './userSlice';

export const uploadImage = createAsyncThunk('user/uploadImage', async (fileData, thunkAPI) => {
  const { profilePicture, userId } = fileData;
  const fileExtension = profilePicture.name.split('.').pop();
  const fileName = `${userId}.${fileExtension}`;
  const storageRef = ref(storage, `profilePictures/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, profilePicture);

  // Create a promise that resolves with the download URL
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log(`Upload is ${progress}% done`);
        thunkAPI.dispatch(updateUploadProgress(progress));
      },
      (error) => {
        reject(error);
      },
      () => {
        // Upload completed successfully, now get download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      },
    );
  });
});

export const listenAuthState = createAsyncThunk('user/listenAuthState', async (_, { dispatch }) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userData = await dispatch(fetchUserById(user.uid));
        dispatch(setCurrentUser(userData));
      } catch (error) {
        // Handle the error, such as dispatching an action to set an error state
        console.log(error);
      }
    } else {
      dispatch(setCurrentUser(null));
    }
  });
});

export const register = createAsyncThunk(
  'user/register',
  async ({ email, password, name, profilePicture }, thunkAPI) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Upload the photo to Firebase Storage
    const downloadURL = await thunkAPI.dispatch(uploadImage({ profilePicture, userId: user.uid }));

    // Update the user's display name and photo URL
    await updateProfile(user, {
      displayName: name,
      photoURL: downloadURL.payload,
    });

    const docRef = doc(db, 'users', user.uid);
    const userObj = {
      uid: user.uid,
      displayName: name,
      email: email,
      isAdmin: false,
      photoURL: downloadURL.payload,
    };

    await setDoc(docRef, userObj);

    return userObj;
  },
);

export const login = createAsyncThunk('user/login', async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  return JSON.stringify(user);
});

export const resetPassword = createAsyncThunk('user/resetPassword', async (email, thunkAPI) => {
  await sendPasswordResetEmail(auth, email).then(() => {
    thunkAPI.dispatch(updateEmailSent());
  });
});

export const fetchUserById = createAsyncThunk('user/fetchUserById', async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    return userDocSnapshot.data();
  }
  // } else {
  //   throw new Error(`User with ID ${userId} does not exist`);
  // }
});

export const updateProfilePicture = createAsyncThunk(
  'user/updateProfilePicture',
  async (profilePicture, thunkAPI) => {
    const user = auth.currentUser;

    // Upload the photo to Firebase Storage
    const downloadURL = await thunkAPI.dispatch(uploadImage({ profilePicture, userId: user.uid }));

    await updateProfile(user, {
      photoURL: downloadURL.payload,
    });

    // Update the profile picture URL in the users collection
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      photoURL: downloadURL.payload,
    });

    return downloadURL.payload;
  },
);

export const updateProfileInfo = createAsyncThunk('user/updateProfileInfo', async (displayName) => {
  // Get the currently logged-in user
  const user = auth.currentUser;

  // Update the display name in the Firebase Authentication user profile
  await updateProfile(user, {
    displayName: displayName,
  });

  // Update the display name in the users collection
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    displayName: displayName,
  });

  return displayName;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async () => {
  const userId = auth.currentUser.uid;
  const userRef = doc(db, 'users', userId);

  // Get the user's posts
  const userPostsQuery = query(collection(db, 'posts'), where('user', '==', userRef));
  const userPostsSnapshot = await getDocs(userPostsQuery);

  // Delete the user's posts
  userPostsSnapshot.forEach(async (doc) => {
    // Get the files array from the post document
    const filesArray = doc.data().files;

    if (filesArray) {
      // Iterate over the files array and delete the files from storage
      filesArray.forEach(async (file) => {
        // Check if the file has a downloadURL
        if (file.downloadURL) {
          // Delete the file from storage
          const filePath = `postFiles/${doc.data().documentId}`;
          await deleteObject(ref(storage, filePath));
        }
      });
    }

    // Delete the post document
    await deleteDoc(doc.ref);
  });

  // Query the posts collection where comments array is not empty
  const postsQuery = query(collection(db, 'posts'), where('comments', '!=', []));

  // Fetch the posts
  const postsSnapshot = await getDocs(postsQuery);

  // Iterate over the posts
  postsSnapshot.forEach(async (postDoc) => {
    const postData = postDoc.data();
    const comments = postData.comments;

    // Check if comments array exists and is not empty
    if (Array.isArray(comments) && comments.length > 0) {
      // Find the matching comments by the currently signed-in user
      const updatedComments = comments.filter((comment) => !refEqual(comment.user, userRef));

      // Update the post document with the modified comments array
      await updateDoc(postDoc.ref, { comments: updatedComments });
    }
  });

  const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  // Get the user's profile picture URL from auth.currentUser
  const profilePictureURL = auth.currentUser.photoURL;

  // Check if the user has a profile picture URL
  if (profilePictureURL) {
    // Extract the file name from the profile picture URL
    const fileName = profilePictureURL.split('/').pop();

    // Extract the file extension from the file name
    const fileExtension = fileName.split('.').pop().split('?')[0];

    // Check if the file extension is one of the specified image types
    if (fileExtension && imageTypes.includes(`image/${fileExtension}`)) {
      // Delete the user's profile picture
      const profilePicturePath = `profilePictures/${userId}.${fileExtension}`;
      await deleteObject(ref(storage, profilePicturePath));
    }
  }

  // Delete the user
  await deleteDoc(userRef);

  // Sign out the user
  await auth.signOut();
});

export const logout = createAsyncThunk('user/logout', async () => {
  await auth.signOut();
});
