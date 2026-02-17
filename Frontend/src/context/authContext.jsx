/**
 * authContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global Firebase Auth state for the entire app.
 *
 * Provides:
 *  - user        → Firebase User object (null if logged out)
 *  - token       → Firebase ID token (null if logged out)
 *  - loading     → true while Firebase checks initial auth state
 *  - authError   → last auth error string (null if none)
 *  - clearError  → call to reset authError
 *
 * Usage (in any component):
 *   const { user, token, loading } = useAuth();
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [token, setToken]       = useState(null);
  const [loading, setLoading]   = useState(true);   // true until Firebase confirms session
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Firebase listener — fires immediately with current session state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setUser(firebaseUser);
          setToken(idToken);
        } catch (err) {
          console.error('[AuthContext] Token fetch failed:', err.message);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setAuthError(null);

  const value = { user, token, loading, authError, setAuthError, clearError };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};