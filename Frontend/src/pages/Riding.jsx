import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {
  return (
    <div className='h-screen w-screen'>
			<Link to='/home' className='fixed left-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
				<i className="text-lg font-medium ri-home-2-fill"></i>
			</Link>
      <div className='h-1/2 w-full'>
        <img
          className='object-cover h-full w-full'
          src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
          alt=""
        />
      </div>

      <div className='h-1/2 w-full'>
        <div className='w-full border flex justify-between items-center'>
          <img
            className='h-20 p-2'
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n"
            alt=""
          />
          <div className='leading-3 flex flex-col items-end p-3'>
            <h2>Kartik Joshi</h2>
            <h4 className='font-bold text-xl'>MH06AM6969</h4>
            <p className='text-gray-600'>Swift Desire</p>
          </div>
        </div>

        <div className='flex flex-col justify-between items-center'>
          <div className='w-full'>
            <div className='flex justify-start items-center gap-5 px-5 py-3 border'>
              <h4 className='text-2xl'>
                <i className="ri-map-pin-2-line"></i>
              </h4>
              <div className='leading-5'>
                <h3 className='font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600'>Kankariya Talab, Ahmedabad</p>
              </div>
            </div>

            <div className='flex justify-start items-center gap-5 px-5 py-3 border'>
              <h4 className='text-2xl'>
                <i className="ri-map-pin-2-fill"></i>
              </h4>
              <div className='leading-5'>
                <h3 className='font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600'>Kankariya Talab, Ahmedabad</p>
              </div>
            </div>

            <div className='flex justify-start items-center gap-5 px-5 py-3 border'>
              <h4 className='text-2xl'>
                <i className="ri-money-rupee-circle-line"></i>
              </h4>
              <div className='leading-5'>
                <h3 className='font-medium'>₹193</h3>
                <p className='text-sm text-gray-600'>Cash</p>
              </div>
            </div>
          </div>
					<button
						onClick={() => {}}
						className='bg-green-400 w-3/4 py-2 rounded-lg'
					>
						Confirm
					</button>
        </div>
      </div>
    </div>
  )
}

export default Riding