import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainSignup = () => {
  const [email, setemail] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [password, setpassword] = useState('')
  const [userData, setuserData] = useState({})
  
  const submitHandler = (e) => {
    e.preventDefault();
    setuserData({
      fullName:{
        firstName,
        lastName
      },
      email,
      password
    });
    setpassword('');
    setemail('');
    setfirstName('');
    setlastName('');
    console.log(userData);
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
        <form onSubmit={(e) => submitHandler(e)}>
          <img className='w-16 mb-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="" />

          <h3 className='text-md font-semibold mb-2'>What's your name</h3>
          <div className='flex gap-3'>
            <input 
              className='bg-gray-100 rounded px-4 py-2 border w-1/2' 
              required 
              type="text" 
              placeholder='first name'
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
            />
            <input 
              className='bg-gray-100 rounded px-4 py-2 border w-1/2' 
              required 
              type="text" 
              placeholder='last name'
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
            />
          </div>
          
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
          <button className='bg-black w-full text-white mt-4 py-2 active:scale-95 rounded-md'>Sign Up</button>
          <p className='mt-1 text-center'>Already have an account? <Link to="/captain-login" className='text-blue-500'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default CaptainSignup
