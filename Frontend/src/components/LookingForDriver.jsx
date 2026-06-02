import React from 'react'

const LookingForDriver = ({setVehicleFound}) => {
  return (
    <div>
        <h5 onClick={()=>{
          setVehicleFound(false);
        }} className='text-center text-3xl'><i className="ri-arrow-down-wide-line"></i></h5>
        <h2 className='text-center text-2xl font-semibold pb-2'>Looking for a Driver</h2>
        <div className='flex flex-col justify-between'>
            <img className='border' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n" alt="" />
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
        </div>
    </div>
  )
}

export default LookingForDriver