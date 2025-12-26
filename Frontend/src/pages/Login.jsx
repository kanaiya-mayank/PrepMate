import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { auth, googleProvider } from '../firebase/firebaseConfig';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
}  from 'firebase/auth';

 

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // 1. Google Login Logic
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in user:", result.user.email);

      // The AuthContext will automatically pick up the token change
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  // 2. Email/Password Login Logic
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-5 border-2 border-[rgba(255,255,255,0.06)]  rounded-xl flex bg-[#131a2e] w-[40%] justify-center items-center flex-col gap-3" >
        
        <div className='w-full h-20 flex justify-center items-center text-2xl'>
          <img className='w-12 pr-2 h-10' src="/logo.png" alt="" />
          <span>PrepMate</span>
        </div>
        
        <form
          className="p-5 rounded-xl border-2 border-[rgba(255,255,255,0.06)] flex flex-col justify-center items-center gap-3 w-full bg-[#0b101f]"
           action="">
          
            <div className="relative w-full">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                onChange={ e=> setEmail(e.target.value) }
                className="bg-[#05070f] pl-10 outline-0 rounded-md w-full px-3 py-3 text-neutral-300"
                type="email"
                placeholder="Email"
              />
            </div>


            <div className="relative w-full">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                onChange={ e=> setPassword(e.target.value) }
                className="bg-[#05070f] pl-10 rounded-md w-full px-3 py-3 text-neutral-300"
                type="password"
                placeholder="Password"
              />
            </div>

            <button
              onClick={ (e)=>handleEmailAuth(e) }
              className="bg-blue-600 hover:bg-blue-700 transition font-bold text-xl rounded-md w-full px-3 py-3"
            >
              Log In </button>


            <div className="flex items-center w-full gap-3 text-neutral-500">
              <hr className="flex-1 border-neutral-700" />
              <span>OR</span>
              <hr className="flex-1 border-neutral-700" />
            </div>

            
            <button onClick={ (e)=>handleGoogleLogin(e) }>
            <div className="flex items-center justify-center gap-3 bg-[#05070f] 
                hover:bg-[#0b1225]
                transition-colors duration-200
                rounded-md w-full px-3 py-3 
                text-neutral-300 hover:text-neutral-100 
                cursor-pointer">
                <FontAwesomeIcon icon={faGoogle} />
                <span>Continue with Google</span>
              </div>

            </button>


            <a className='text-neutral-500 underline' href="#">Forgot password?</a>
          </form>

          <h3><span className='text-neutral-500 '>Don't have an account?</span> <a className='text-blue-400 font-bold' href="#">Sign up</a></h3>

    </div>
  )
}

export default Login
