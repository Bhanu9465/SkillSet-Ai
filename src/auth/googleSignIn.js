// src/auth/googleSignIn.js

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";

export const handleGoogleSignIn = () => {
  const provider = new GoogleAuthProvider();
  
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in successfully
    })
    .catch((error) => {
      // Handle sign-in error
    });
};
