import React from 'react'

const WaitingForDriver = ({setwaitingForDriver}) => {
  return (
    <div>
        <h5 onClick={()=>{
          setwaitingForDriver(false);
        }} className='text-center text-3xl'><i className="ri-arrow-down-wide-line"></i></h5>
        <div className='w-full border flex justify-between items-center'>
            <img className='h-20 p-2' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n" alt="" />
            <div className='leading-3 flex flex-col items-end p-3'>
                <h2>Kartik Joshi</h2>
                <h4 className='font-bold text-xl'>MH06AM6969</h4>
                <p className='text-gray-600'>Swift Desire</p>
            </div>
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
        </div>
    </div>
  )
}

export default WaitingForDriver