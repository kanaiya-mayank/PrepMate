// import Dashboard from './pages/dashboard'
// import Login from './pages/Login'

// function App() {

//   return (
//     <>
//     <div className='w-screen text-white h-screen flex justify-center items-center bg-[url("/login_bg_image.jpeg")] bg-cover'>
//       <Login />
//     </div>
//     </>

//   )
// }

// export default App

/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root application component.
 *
 * Routing logic:
 *  /login    → Login page  (public)
 *  /signup   → SignUp page (public)
 *  /dashboard → Dashboard  (protected — requires auth)
 *  /         → redirects to /login or /dashboard based on auth state
 *
 * AuthGuard: if a logged-in user tries to visit /login or /signup,
 * they are redirected to /dashboard automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Login    from './pages/Login';
import SignUp   from './pages/SignUp';

// Lazy-load heavy pages (performance best practice)
const Dashboard = React.lazy(() => import('./pages/dashboard'));

// ── Protected Route wrapper ───────────────────────────────────────────────────
// Redirects unauthenticated users to /login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

// ── Public Route wrapper ──────────────────────────────────────────────────────
// Redirects already-logged-in users away from auth pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ── Full-page loader (while Firebase checks session) ─────────────────────────
const PageLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#080d1a]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center animate-pulse">
        <span className="text-2xl">🧠</span>
      </div>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Default: redirect based on auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login"  element={<PublicRoute><Login  /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </AuthProvider>
  </BrowserRouter>
);

export default App;