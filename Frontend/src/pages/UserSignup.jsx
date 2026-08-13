import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'
import {SocketDataContext} from '../context/SocketContext'

const UserSignup = () => {
  const [email, setemail] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [password, setpassword] = useState('')

  const navigate = useNavigate();

  const {user, setuser} = useContext(UserDataContext);
  const { connectSocketWithToken } = useContext(SocketDataContext);

  const submitHandler = async(e) => {
    e.preventDefault();
    const newUser = {
      fullName:{
        firstName,
        lastName
      },
      email,
      password
    };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if(response.status == 201){
      const data = response.data
      setuser(data.user)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('role', 'user');
      if (connectSocketWithToken) connectSocketWithToken(data.token, 'user');
      navigate('/home')
    }


    setpassword('');
    setemail('');
    setfirstName('');
    setlastName('');
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
        <form onSubmit={(e) => submitHandler(e)}>
          <img className='w-16 mb-5' src="" alt="" />

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
          <button className='bg-black w-full text-white mt-4 py-2 active:scale-95 rounded-md'>Create Your Account</button>
          <p className='mt-1 text-center'>Already have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default UserSignup
