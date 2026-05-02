// FUNCTIONALITY: auth logic + firestore integration
import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "../../utils/firestore";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FUNCTIONALITY: save user to firestore if not exists
  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "Senders", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      console.log("Creating new user in Firestore");

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
    } else {
      console.log("User already exists");
    }
  };

  // FUNCTIONALITY: Google Sign-In
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google Login:", user);

      await saveUserToFirestore(user);

      return user;
    } catch (err) {
      console.error("Google Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FUNCTIONALITY: email login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await signInWithEmailAndPassword(auth, email, password);

      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // FUNCTIONALITY: signup
  const signup = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await saveUserToFirestore(res.user);

      return res.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    signInWithGoogle,
    loading,
    error,
  };
}