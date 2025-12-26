import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRhOQbNoIEUqYRumjnfYGFHtsegRPqNrQ",
  authDomain: "prepmate-360b5.firebaseapp.com",
  projectId: "prepmate-360b5",
  storageBucket: "prepmate-360b5.firebasestorage.app",
  messagingSenderId: "692913648778",
  appId: "1:692913648778:web:5d7fc2bf3da2f5478be973",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export both auth and the provider
export { auth, googleProvider };