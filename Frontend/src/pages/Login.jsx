import React from 'react'

function Login() {
  return (
    <div className="p-5 border-2 border-[rgba(255,255,255,0.06)]  rounded-xl flex bg-[#131a2e] w-[40%] justify-center items-center flex-col gap-3" >
        <div className='w-full h-20 flex justify-center items-center text-2xl'>
          <img className='w-12 pr-2 h-10' src="/logo.png" alt="" />
          <span>PrepMate</span>
          </div>
        <form
          className="p-5 rounded-xl border-2 border-[rgba(255,255,255,0.06)] flex flex-col justify-center items-center gap-3 w-full bg-[#0b101f]"
           action="">
            <input className='bg-[#05070f] outline-0 rounded-sm w-full px-3 py-2 ' type="text" placeholder='Username/Email' />
            <input className='bg-[#05070f] rounded-sm w-full px-3 py-2 ' type="password" placeholder='Password' />
            <input className=" bg-blue-700 font-bold text-xl rounded-sm w-full px-3 py-2" type="submit" value="Login" />

            <div className=' text-neutral-500 w-full text-center text-xl'>
              <h1>----------OR----------</h1>
            </div>

            <a className='bg-[#05070f] rounded-sm w-full px-3 py-2 text-center text-xl text-neutral-400 ' href="#">Continue with Google</a>

            <a className='text-neutral-500' href="#">Forgot password?</a>
          </form>

          <h3><span className='text-neutral-500 '>Don't have an account?</span> <a className='text-blue-400 font-bold' href="#">Sign up</a></h3>

    </div>
  )
}

export default Login
