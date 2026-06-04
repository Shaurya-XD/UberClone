import React from 'react'
import { Link } from 'react-router-dom'

const FinishRidePopUp = ({setfinishRidePanel}) => {
  return (
    <div className='pb-3'>
        <h5 onClick={()=>{
            setfinishRidePanel(false)
        }} className='text-center text-3xl -mb-2'><i className="ri-arrow-down-wide-line"></i></h5>
         <h2 className='text-center text-2xl font-semibold'>Finish this Ride</h2>
        <div className='flex justify-between items-center bg-yellow-300 mx-2 mb-2 rounded-2xl my-4'>
            <div className='flex justify-start items-center'>
                <img className='p-2 h-16 w-16 object-cover rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmAAuoVZZwjZYKQA_oJBPSpa_-LbPcBUPuiA&s" alt="" />
                <h2 className='text-xl font-medium'>Eren Yeager</h2>
            </div>
            <h5 className='px-2 text-lg font-semibold'>2.2 KM</h5>
        </div>
        <div>
            <div className='py-4'>
                <div className='flex justify-start items-center gap-5 px-5 py-3 border '>
                    <h4 className='text-2xl'><i className="ri-map-pin-2-line"></i></h4>
                    <div className='leading-5'>
                        <h3 className='font-medium'>562/11-A</h3>
                        <p className='text-sm text-gray-600'>Kankariya Talab, Ahembdabad</p>
                    </div>
                </div>
                <div className='flex justify-start items-center gap-5 px-5 py-3 border '>
                    <h4 className='text-2xl'><i className="ri-map-pin-2-fill"></i></h4>
                    <div className='leading-5'>
                        <h3 className='font-medium'>562/11-A</h3>
                        <p className='text-sm text-gray-600'>Kankariya Talab, Ahembdabad</p>
                    </div>
                </div>
                <div className='flex justify-start items-center gap-5 px-5 py-3 border '>
                    <h4 className='text-2xl'><i className="ri-money-rupee-circle-line"></i></h4>
                    <div className=' leading-5'>
                        <h3 className='font-medium'>₹193</h3>
                        <p className='text-sm text-gray-600'>Cash</p>
                    </div>
                </div>
            </div>
            
            <div className='px-3'>
                <Link to='/captain-home' className='bg-green-400 py-2 flex justify-center rounded-lg text-white'>Finish Ride</Link>
            </div>
            
        </div>
    </div>
  )
}

export default FinishRidePopUp