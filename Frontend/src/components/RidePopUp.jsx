import React from 'react'

const RidePopUp = ({setridePopUpPanel, setconfirmRidePopUpPanel}) => {
  return (
    <div className='pt-2'>
        {/* <h5 onClick={()=>{
          setridePopUpPanel(false)
        }} className='text-center text-3xl'><i className="ri-arrow-down-wide-line"></i></h5> */}
        <h2 className='text-center text-2xl font-semibold pb-2'>New Ride Available</h2>
        <div className='flex justify-between items-center bg-yellow-300 mx-2 mb-2 rounded-2xl'>
            <div className='flex justify-start items-center'>
                <img className='p-2 h-16 w-16 object-cover rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmAAuoVZZwjZYKQA_oJBPSpa_-LbPcBUPuiA&s" alt="" />
                <h2 className='text-xl font-medium'>Eren Yeager</h2>
            </div>
            <h5 className='px-2 text-lg font-semibold'>2.2 KM</h5>
        </div>
        <div className='flex flex-col justify-between'>
            <div>
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
            <div className='flex justify-between items-center px-10'>
                <button onClick={()=>{
                    setridePopUpPanel(false)
                }} className='bg-gray-400 my-2 py-1 px-10 rounded-lg text-white'>Ignore</button>
                <button onClick={()=>{
                    setconfirmRidePopUpPanel(true)
                }} className='bg-green-400 my-2 py-1 px-10 rounded-lg text-white'>Accept</button>
            </div>
        </div>
    </div>
  )
}

export default RidePopUp