// import React, { useState } from 'react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
// import { faGoogle } from '@fortawesome/free-brands-svg-icons'

// import { auth, googleProvider } from '../config/firebaseConfig';
// import { 
//   signInWithPopup, 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword 
// }  from 'firebase/auth';

 

// function Login() {

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);

//   // 1. Google Login Logic
//   const handleGoogleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       console.log("Logged in user:", result.user.email);

//       // The AuthContext will automatically pick up the token change
//     } catch (error) {
//       console.error("Google Login Error:", error.message);
//     }
//   };

//   // 2. Email/Password Login Logic
//   const handleEmailAuth = async (e) => {
//     e.preventDefault();
//     try {
//       if (isRegistering) {
//         await createUserWithEmailAndPassword(auth, email, password);
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="p-5 border-2 border-[rgba(255,255,255,0.06)]  rounded-xl flex bg-[#131a2e] w-[40%] justify-center items-center flex-col gap-3" >
        
//         <div className='w-full h-20 flex justify-center items-center text-2xl'>
//           <img className='w-12 pr-2 h-10' src="/logo.png" alt="" />
//           <span>PrepMate</span>
//         </div>
        
//         <form
//           className="p-5 rounded-xl border-2 border-[rgba(255,255,255,0.06)] flex flex-col justify-center items-center gap-3 w-full bg-[#0b101f]"
//            action="">
          
//             <div className="relative w-full">
//               <FontAwesomeIcon
//                 icon={faUser}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
//               />
//               <input
//                 onChange={ e=> setEmail(e.target.value) }
//                 className="bg-[#05070f] pl-10 outline-0 rounded-md w-full px-3 py-3 text-neutral-300"
//                 type="email"
//                 placeholder="Email"
//               />
//             </div>


//             <div className="relative w-full">
//               <FontAwesomeIcon
//                 icon={faLock}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
//               />
//               <input
//                 onChange={ e=> setPassword(e.target.value) }
//                 className="bg-[#05070f] pl-10 outline-0 rounded-md w-full px-3 py-3 text-neutral-300"
//                 type="password"
//                 placeholder="Password"
//               />
//             </div>

//             <button
//               onClick={ (e)=>handleEmailAuth(e) }
//               className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition font-bold text-xl rounded-md w-full px-3 py-3"
//             >
//               Log In </button>


//             <div className="flex items-center w-full gap-3 text-neutral-500">
//               <hr className="flex-1 border-neutral-700" />
//               <span>OR</span>
//               <hr className="flex-1 border-neutral-700" />
//             </div>

            
//             <button onClick={ (e)=>handleGoogleLogin(e) }>
//             <div className="flex items-center justify-center gap-3 bg-[#05070f] 
//                 hover:bg-[#0b1225]
//                 transition-colors duration-200
//                 rounded-md w-full px-3 py-3 
//                 text-neutral-300 hover:text-neutral-100 
//                 cursor-pointer">
//                 <FontAwesomeIcon icon={faGoogle} />
//                 <span>Continue with Google</span>
//               </div>

//             </button>


//             <a className='text-neutral-500 underline' href="#">Forgot password?</a>
//           </form>

//           <h3><span className='text-neutral-500 '>Don't have an account?</span> <a className='text-blue-400 font-bold' href="#">Sign up</a></h3>

//     </div>
//   )
// }

// export default Login


/**
 * Login.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Login page for PrepMate.
 *
 * Features:
 *  - Email + password login
 *  - Google OAuth login
 *  - Forgot password (sends Firebase reset email)
 *  - Inline form validation (before hitting Firebase)
 *  - Clear error messages from authService
 *  - Loading states on buttons (prevents double submit)
 *  - Link to /signup page
 *
 * After successful login → AuthContext updates → App.jsx redirects to /dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, sendPasswordReset } from '../firebase/authService';

// SVG Icons (inline — no extra icon library needed)
const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

// Reusable InputField component
const InputField = ({ id, label, type, value, onChange, placeholder, icon: Icon, error, rightElement }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    <div className="relative">
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${error ? 'text-red-400' : 'text-slate-500'}`}>
        <Icon />
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={id}
        className={`
          w-full pl-10 pr-10 py-3 rounded-xl text-sm
          bg-[#0d1424] text-slate-200 placeholder-slate-600
          border transition-all duration-200 outline-none
          ${error
            ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
            : 'border-white/[0.07] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20'
          }
        `}
      />
      {rightElement && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </span>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// Main Login Component
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [errors, setErrors]           = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loadingEmail, setLoadingEmail]   = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [resetSent, setResetSent]         = useState(false);

  const isLoading = loadingEmail || loadingGoogle;

  const validate = () => {
    const newErrors = {};
    if (!email.trim())
      newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Enter a valid email address.';
    if (!password)
      newErrors.password = 'Password is required.';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setResetSent(false);
    if (!validate()) return;

    setLoadingEmail(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGlobalError('');
    setResetSent(false);
    setLoadingGoogle(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Enter your email above first, then click Forgot password.' });
      return;
    }
    setGlobalError('');
    try {
      await sendPasswordReset(email);
      setResetSent(true);
    } catch (err) {
      setGlobalError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#080d1a] px-4 py-12">

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[140px]" />
        <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[420px]">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
            bg-gradient-to-br from-blue-500 to-violet-600
            shadow-lg shadow-blue-500/30 mb-4">
            <span className="text-2xl" role="img" aria-label="brain">🧠</span>
          </div>

          <h1 className="text-[2rem] font-black tracking-tight leading-none text-white">
            Prep
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Mate
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Your competitive exam command centre
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111827]/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/50">

          <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-7">Sign in to continue your preparation</p>

          {/* Error banner */}
          {globalError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{globalError}</span>
            </div>
          )}

          {/* Reset success banner */}
          {resetSent && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-sm flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5">✅</span>
              <span>Password reset email sent! Check your inbox.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} noValidate>
            <div className="flex flex-col gap-5">

              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="you@example.com"
                icon={MailIcon}
                error={errors.email}
              />

              <InputField
                id="current-password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                icon={LockIcon}
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                }
              />

              {/* Forgot password */}
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full py-3 px-4 rounded-xl font-bold text-sm text-white
                  bg-gradient-to-r from-blue-600 to-blue-500
                  hover:from-blue-500 hover:to-blue-400
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-blue-500/20
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                {loadingEmail ? (
                  <><SpinnerIcon /> Signing in…</>
                ) : (
                  'Sign In →'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-600 font-medium tracking-wider">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="
              w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-300
              bg-white/[0.04] hover:bg-white/[0.08]
              border border-white/[0.07] hover:border-white/[0.14]
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center justify-center gap-3
            "
          >
            {loadingGoogle ? (
              <><SpinnerIcon /> Connecting…</>
            ) : (
              <><GoogleIcon /> Continue with Google</>
            )}
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-slate-500 text-sm mt-6">
          New to PrepMate?{' '}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Create a free account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;