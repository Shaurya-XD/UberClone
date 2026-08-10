import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketDataContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setemail] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [password, setpassword] = useState('')
  const [vehicleColor, setvehicleColor] = useState('')
  const [vehiclePlate, setvehiclePlate] = useState('')
  const [vehicleCapacity, setvehicleCapacity] = useState('')
  const [vehicleType, setvehicleType] = useState('')

  const {captain, setcaptain} = useContext(CaptainDataContext);
  const { connectSocketWithToken } = useContext(SocketDataContext);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    const captainInfo = {
      fullName:{
        firstName,
        lastName
      },
      email,
      password,
      vehicle:{
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType
      }
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainInfo)

    if(response.status === 201){
      const data = response.data;
      setcaptain(data.captain);
      localStorage.setItem('token', data.token);
      localStorage.setItem('captainToken', data.token);
      localStorage.setItem('role', 'captain');
      if (connectSocketWithToken) connectSocketWithToken(data.token, 'captain');
      navigate('/captain-home');
    }


    setpassword('');
    setemail('');
    setfirstName('');
    setlastName('');
    setvehicleCapacity('');
    setvehicleColor('');
    setvehiclePlate('');
    setvehicleType('')
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
          <h3 className='text-md font-semibold mb-2'>Enter Vehicle Information</h3>
          <div className='flex gap-3 mb-3'>
            <input 
              className='bg-gray-100 rounded px-4 py-2 border w-1/2' 
              required 
              type="text" 
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => setvehicleColor(e.target.value)}
            />
            <input 
              className='bg-gray-100 rounded px-4 py-2 border w-1/2' 
              required 
              type="text" 
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => setvehiclePlate(e.target.value)}
            />
          </div>
          <div className='flex gap-3'>
            <input 
              className='bg-gray-100 rounded px-4 py-2 border w-1/2' 
              required 
              type="number" 
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => setvehicleCapacity(e.target.value)}
            />
            <select 
              className='bg-gray-100 rounded px-4 py-2 border w-1/2' 
              required 
              value={vehicleType}
              onChange={(e) => setvehicleType(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Auto Rickshaw</option>
            </select>
          </div>
          <button className='bg-black w-full text-white mt-4 py-2 active:scale-95 rounded-md'>Create Captain Account</button>
          <p className='mt-1 text-center'>Already have an account? <Link to="/captain-login" className='text-blue-500'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default CaptainSignup
