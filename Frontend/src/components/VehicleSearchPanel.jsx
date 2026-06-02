import React from 'react'

const VehicleSearchPanel = ({setvehiclePanel, setconfirmRidePanel}) => {
  return (
    <div>
        <h5 onClick={()=>{
          setvehiclePanel(false);
        }} className='text-center text-3xl'><i className="ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-3xl px-3 font-semibold'>Choose a vehicle</h3>
        <div onClick={()=>{
            setconfirmRidePanel(true);
            setvehiclePanel(false);
        }} className='flex justify-between items-center border active:border-black bg-gray-100 rounded-xl px-2 mx-2 my-3 py-3'>
            <img className='h-14' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n" alt="" />
            <div className='w-1/2'>
            <h4 className='font-medium text-m'>UberGo <span><i className="ri-user-3-line"></i>4</span></h4>
            <h5 className='font-medium text-sm'>2 mins away</h5>
            <p className='font-normal text-gray-600 text-sm '>Affordable, compact ride</p>
            </div>
            <h2 className='text-xl font-semibold'>₹193</h2>
        </div>

        <div onClick={()=>{
            setconfirmRidePanel(true);
            setvehiclePanel(false);
        }} className='flex justify-between items-center border active:border-black bg-gray-100 rounded-xl px-2 mx-2 my-3 py-3'>
            <img className='h-14 px-4' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9lZjA5NThiZC1kNDMwLTQ1ZWYtYmU2Yi0zYmZiY2JmMDYyZjYucG5n" alt="" />
            <div className='w-1/2'>
            <h4 className='font-medium text-m'>Moto <span><i className="ri-user-3-line"></i>1</span></h4>
            <h5 className='font-medium text-sm'>3 mins away</h5>
            <p className='font-normal text-gray-600 text-sm '>Affordable, moto ride</p>
            </div>
            <h2 className='text-xl font-semibold'>₹65</h2>
        </div>

        <div onClick={()=>{
            setconfirmRidePanel(true);
            setvehiclePanel(false);
        }} className='flex justify-between items-center border active:border-black rounded-xl px-2 bg-gray-100 mx-2 my-3 py-3'>
            <img className='h-14' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=0/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy80ZTcxOGQ1Yy1lNDMxLTU5YzUtYWNiNS1hYzQwYzI2YzI0ZGYud2VicA==" alt="" />
            <div className='w-1/2'>
            <h4 className='font-medium text-m'>UberAuto <span><i className="ri-user-3-line"></i>2</span></h4>
            <h5 className='font-medium text-sm'>5 mins away</h5>
            <p className='font-normal text-gray-600 text-sm '>Affordable, Indian ride</p>
            </div>
            <h2 className='text-xl font-semibold'>₹118</h2>
        </div>
    </div>
  )
}

export default VehicleSearchPanel