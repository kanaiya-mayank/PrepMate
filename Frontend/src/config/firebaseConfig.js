import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ4Iz3bN-V3as_uWFZRo9D3KLCRsvkxHs",
  authDomain: "prepmate-154ef.firebaseapp.com",
  projectId: "prepmate-154ef",
  storageBucket: "prepmate-154ef.firebasestorage.app",
  messagingSenderId: "65528032300",
  appId: "1:65528032300:web:646a711a4a3a65dc717589",
  measurementId: "G-EX2XQZ3FED"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Export both auth and the provider
export { auth, googleProvider, analytics };


