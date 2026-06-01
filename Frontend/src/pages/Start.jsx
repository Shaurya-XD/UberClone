import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
        <div className='bg-cover bg-[url(https://images.stockcake.com/public/0/0/9/009e6881-cd84-498e-9f05-218d071bfd6c/sunset-traffic-light-stockcake.jpg)] pt-5 h-screen w-full bg-white flex flex-col justify-between'>
            <img className='w-16 ml-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="" />
            <div className='bg-white rounded py-4 px-4 pb-7'>
                <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
                <Link to="/login" className='flex items-center justify-center bg-black w-full text-white mt-4 py-2 px-4 rounded-md hover:bg-gray-800'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Start