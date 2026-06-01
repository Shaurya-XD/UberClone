import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/userContext'
import axios from 'axios'

const UserLogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const {user, setuser} = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async(e) => {
    e.preventDefault();
    const user = {
      email,
      password
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, user);
    if(response.status == 200){
      const data = response.data;
      setuser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home')
    }

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
            placeholder='Enter user email'
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <h3 className='text-md font-semibold mt-2 mb-2'>Enter Password</h3>
          <input 
            required 
            className='bg-gray-100 mb-3 rounded px-4 py-2 border w-full' 
            type="password" 
            placeholder='Enter user password'
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <button className='bg-black w-full text-white mt-4 py-2 active:scale-95 rounded-md'>Login</button>
          <p className='mt-1 text-center'>New Here? <Link to="/signup" className='text-blue-500'>Create User Account</Link></p>
        </form>
      </div>
      <div>
        <Link to="/captain-login" className='flex items-center justify-center bg-green-500 w-full text-white py-2 rounded-md active:scale-95'>Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin