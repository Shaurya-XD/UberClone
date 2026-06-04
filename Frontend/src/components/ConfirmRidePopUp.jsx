import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const ConfirmRidePopUp = ({ setconfirmRidePopUpPanel, setridePopUpPanel }) => {
	const [otp, setotp] = useState('')
	const submitHandler = (e) => {
		e.preventDefault();
	}
	return (
		<div className='h-screen pt-3'>
			<h5 onClick={()=>{
            setconfirmRidePopUpPanel(false)
        }} className='text-center text-3xl'><i className="ri-arrow-down-wide-line"></i></h5>
			<h2 className='text-center text-2xl font-semibold py-2'>Confirm this ride to Start</h2>
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

				<form className='px-6 mt-14 py-4' onSubmit={(e) => {
					submitHandler(e)
				}}>
					<input value={otp} onChange={(e)=> {
						setotp(e.target.value)
					}} type="text" placeholder='Enter OTP' className='bg-gray-200 w-full text-black rounded-lg px-10 py-2 mb-2' />
					<div className='flex justify-between items-center'>
						<button onClick={() => {
							setconfirmRidePopUpPanel(false)
							setridePopUpPanel(false)
						}} className='bg-red-500 my-2 py-1.5 px-12 rounded-lg text-white'>Cancel</button>
						<Link to='/captain-riding' className='bg-green-400 my-2 py-1.5 px-12 rounded-lg text-white'>Confirm</Link>
					</div>
				</form>

			</div>
		</div>
	)
}

export default ConfirmRidePopUp