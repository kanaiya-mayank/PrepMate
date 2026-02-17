// import Topbar from "./Topbar";

// export default function DashboardLayout({ children }) {
//   return (
//     <main
//       className="
//         min-h-screen relative overflow-hidden
//         text-white
//         bg-[linear-gradient(135deg,#0B1020_0%,#0F172A_45%,#141A2E_100%)]
//       "
//     >
//       {/* Radial glow */}
//       <div
//         className="absolute inset-0 pointer-events-none
//         bg-[radial-gradient(circle_at_50%_30%,rgba(58,122,254,0.12),transparent_60%)]"
//       />

//       <Topbar />

//       {/* FORCE text color inheritance */}
//       <div className="relative z-10 text-white/80">
//         {children}
//       </div>
//     </main>
//   );
// }


/**
 * Topbar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Top navigation bar shown on all protected pages.
 *
 * Shows:
 *  - PrepMate logo / brand
 *  - Logged-in user email (from AuthContext)
 *  - Logout button → calls Firebase signOut → AuthContext clears user
 *    → App.jsx ProtectedRoute redirects to /login automatically
 *
 * No manual session/localStorage clearing needed — Firebase handles it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { logout } from '../firebase/authService';

// SVG Icons
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

const Topbar = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Get display name: prefer displayName (Google), fallback to email prefix
  const displayName = user?.displayName
    || user?.email?.split('@')[0]
    || 'User';

  // First letter for avatar
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // AuthContext listener fires → sets user to null
      // ProtectedRoute in App.jsx detects user = null → redirects to /login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('[Topbar] Logout failed:', err.message);
      setLoggingOut(false);
    }
  };

  return (
    <header className="
      relative z-20
      flex items-center justify-between
      px-6 py-4
      border-b border-white/[0.06]
      bg-[#0b0f1a]/80 backdrop-blur-md
    ">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600
          flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-base" role="img" aria-label="brain">🧠</span>
        </div>
        <span className="text-lg font-black tracking-tight text-white">
          Prep
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Mate
          </span>
        </span>
      </div>

      {/* Right side — user info + logout */}
      <div className="flex items-center gap-3">

        {/* User avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600
            flex items-center justify-center text-sm font-bold text-white
            shadow-md shadow-blue-500/20">
            {avatarLetter}
          </div>
          <span className="text-sm font-medium text-slate-300 hidden sm:block">
            {displayName}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/[0.08]" />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            text-slate-400 hover:text-red-400
            hover:bg-red-500/10
            border border-transparent hover:border-red-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
          title="Sign out"
        >
          {loggingOut ? <SpinnerIcon /> : <LogoutIcon />}
          <span className="hidden sm:block">
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </span>
        </button>

      </div>
    </header>
  );
};

export default Topbar;