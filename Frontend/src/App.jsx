// /**
//  * FINAL App.jsx - REPLACE YOUR CURRENT FILE
//  * ═══════════════════════════════════════════════════════════════════════════
//  * Fixed routing structure that matches Sidebar navigation
//  * All planner pages accessible from sidebar
//  * ═══════════════════════════════════════════════════════════════════════════
//  */

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/authContext';

// // Auth Pages
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';

// // Main Pages
// import Dashboard from './pages/dashboard';
// import RevisionPage from './pages/RevisionPage';
// import YearlyPlanner from './pages/YearlyPlanner';
// import MonthlyPlanner from './pages/MonthlyPlanner';
// import WeeklyPlanner from './pages/WeeklyPlanner';
// import DailyPlanner from './pages/DailyPlanner';

// // ── Protected Route Component ─────────────────────────────────────────────
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#060914] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent
//             rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-slate-500 text-sm">Loading PrepMate...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return user ? children : <Navigate to="/login" replace />;
// };

// // ── Public Route Component (redirects if logged in) ───────────────────────
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div className="min-h-screen bg-[#060914]" />;
//   }
  
//   return user ? <Navigate to="/dashboard" replace /> : children;
// };

// // ── Main App Component ─────────────────────────────────────────────────────
// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         {/* ══════════════════════════════════════════════════════════════ */}
//         {/* PUBLIC ROUTES */}
//         {/* ══════════════════════════════════════════════════════════════ */}
//         <Route 
//           path="/login" 
//           element={<PublicRoute><Login /></PublicRoute>} 
//         />
//         <Route 
//           path="/signup" 
//           element={<PublicRoute><SignUp /></PublicRoute>} 
//         />
        
//         {/* ══════════════════════════════════════════════════════════════ */}
//         {/* PROTECTED ROUTES */}
//         {/* ══════════════════════════════════════════════════════════════ */}
        
//         {/* Dashboard */}
//         <Route 
//           path="/dashboard" 
//           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
//         />
        
//         {/* Revision */}
//         <Route 
//           path="/revision" 
//           element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} 
//         />
        
//         {/* Planners - Note the routes match Sidebar navigation */}
//         <Route 
//           path="/yearly" 
//           element={<ProtectedRoute><YearlyPlanner /></ProtectedRoute>} 
//         />
//         <Route 
//           path="/monthly" 
//           element={<ProtectedRoute><MonthlyPlanner /></ProtectedRoute>} 
//         />
//         <Route 
//           path="/weekly" 
//           element={<ProtectedRoute><WeeklyPlanner /></ProtectedRoute>} 
//         />
//         <Route 
//           path="/daily" 
//           element={<ProtectedRoute><DailyPlanner /></ProtectedRoute>} 
//         />
        
//         {/* ══════════════════════════════════════════════════════════════ */}
//         {/* REDIRECTS */}
//         {/* ══════════════════════════════════════════════════════════════ */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;











/**
 * FINAL App.jsx - REPLACE YOUR CURRENT FILE
 * ═══════════════════════════════════════════════════════════════════════════
 * Fixed routing structure that matches Sidebar navigation
 * All planner pages accessible from sidebar
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { Suspense, lazy } from 'react'; // Added Suspense and lazy
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';

// Auth Pages - Lazy Loaded
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));

// Main Pages - Lazy Loaded
const Dashboard = lazy(() => import('./pages/dashboard'));
const RevisionPage = lazy(() => import('./pages/RevisionPage'));
const YearlyPlanner = lazy(() => import('./pages/YearlyPlanner'));
const MonthlyPlanner = lazy(() => import('./pages/MonthlyPlanner'));
const WeeklyPlanner = lazy(() => import('./pages/WeeklyPlanner'));
const DailyPlanner = lazy(() => import('./pages/DailyPlanner'));

// ── Protected Route Component ─────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060914] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent
            rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading PrepMate...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// ── Public Route Component (redirects if logged in) ───────────────────────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#060914]" />;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ── Main App Component ─────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      {/* Wrap everything in Suspense to show a fallback during route transitions */}
      <Suspense fallback={
        <div className="min-h-screen bg-[#060914] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* PUBLIC ROUTES */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <Route 
            path="/login" 
            element={<PublicRoute><Login /></PublicRoute>} 
          />
          <Route 
            path="/signup" 
            element={<PublicRoute><SignUp /></PublicRoute>} 
          />
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* PROTECTED ROUTES */}
          {/* ══════════════════════════════════════════════════════════════ */}
          
          {/* Dashboard */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          
          {/* Revision */}
          <Route 
            path="/revision" 
            element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} 
          />
          
          {/* Planners - Note the routes match Sidebar navigation */}
          <Route 
            path="/yearly" 
            element={<ProtectedRoute><YearlyPlanner /></ProtectedRoute>} 
          />
          <Route 
            path="/monthly" 
            element={<ProtectedRoute><MonthlyPlanner /></ProtectedRoute>} 
          />
          <Route 
            path="/weekly" 
            element={<ProtectedRoute><WeeklyPlanner /></ProtectedRoute>} 
          />
          <Route 
            path="/daily" 
            element={<ProtectedRoute><DailyPlanner /></ProtectedRoute>} 
          />
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* REDIRECTS */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;