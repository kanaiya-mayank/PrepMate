/**
 * logoutAuth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase logout helper.
 * Already exported from authService.js too — this file exists for
 * backward compatibility with any existing imports of logoutAuth.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const logoutUser = async () => {
  try {
    await signOut(auth);
    // Firebase automatically clears its own session/token from localStorage.
    // No manual session storage clearing needed.
  } catch (err) {
    throw new Error('Failed to log out. Please try again.');
  }
};

export default logoutUser;