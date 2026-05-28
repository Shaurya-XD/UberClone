import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [captainData, setcaptainData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault();
    setcaptainData({
      email,
      password
    });
    setpassword('');
    setemail('');
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
        <form onSubmit={(e) => submitHandler(e)}>
          <img className='w-16 mb-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="" />
          <h3 className='text-md font-semibold mb-2'>What's your email</h3>
          <input 
            className='bg-gray-100 rounded px-4 py-2 border w-full' 
            required 
            type="email" 
            placeholder='Enter captain email'
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <h3 className='text-md font-semibold mt-2 mb-2'>Enter Password</h3>
          <input 
            required 
            className='bg-gray-100 mb-3 rounded px-4 py-2 border w-full' 
            type="password" 
            placeholder='Enter captain password'
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <button className='bg-black w-full text-white mt-4 py-2 active:scale-95 rounded-md'>Login</button>
          <p className='mt-1 text-center'>New Here? <Link to="/captain-signup" className='text-blue-500'>Create Captain Account</Link></p>
        </form>
      </div>
      <div>
        <Link to="/login" className='flex items-center justify-center bg-orange-500 w-full text-white py-2 rounded-md active:scale-95'>Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin