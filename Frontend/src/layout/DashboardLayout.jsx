// import Topbar from "./Topbar";

// export default function DashboardLayout({ children }) {
//   return (
//     <main
//       className="min-h-screen relative overflow-hidden
//       bg-[linear-gradient(135deg,#0B1020_0%,#0F172A_45%,#141A2E_100%)]"
//     >
//       {/* Radial glow */}
//       <div
//         className="absolute inset-0 pointer-events-none
//         bg-[radial-gradient(circle_at_50%_30%,rgba(58,122,254,0.12),transparent_60%)]"
//       />

//       <Topbar />

//         <div className="relative z-10 text-white/80">
//           {children}
//         </div>
//     </main>
//   );
// }


/**
 * DashboardLayout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Wrapper layout for all protected/dashboard pages.
 * Includes the Topbar (which has the logout button).
 *
 * Usage:
 *   <DashboardLayout>
 *     <YourPageContent />
 *   </DashboardLayout>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import Topbar from './Topbar';

const DashboardLayout = ({ children }) => {
  return (
    <main className="
      min-h-screen relative overflow-hidden text-white
      bg-[linear-gradient(135deg,#0B1020_0%,#0F172A_45%,#141A2E_100%)]
    ">
      {/* Ambient radial glow */}
      <div className="
        absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_50%_30%,rgba(58,122,254,0.12),transparent_60%)]
      " />

      {/* Top navigation bar with logout */}
      <Topbar />

      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;