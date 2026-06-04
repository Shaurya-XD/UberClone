import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FinishRidePopUp from '../components/FinishRidePopUp'

const CaptainRiding = () => {
	const [finishRidePanel, setfinishRidePanel] = useState(false)

	const finishRidePanelRef = useRef(null)

	useGSAP(() => {
		if (finishRidePanel) {
			gsap.to(finishRidePanelRef.current, {
				transform: 'translateY(0%)'
			})
		} else {
			gsap.to(finishRidePanelRef.current, {
				transform: 'translateY(100%)'
			})
		}
	}, [finishRidePanel])

	return (
		<div className='h-screen w-screen'>
			<div className='fixed left-3 top-3 flex justify-between items-center w-full' >
				<img className='w-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
				<Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full mr-5'>
					<i className="text-lg font-medium ri-logout-box-fill"></i>
				</Link>
			</div>
			<div className='h-5/6 w-full'>
				<img
					className='object-cover h-full w-full'
					src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
					alt=""
				/>
			</div>

			<div onClick={() => {
				setfinishRidePanel(true)
			}} className='bg-yellow-400 h-1/6 w-full p-4'>
				<h5 className='text-center text-3xl -mt-3'><i className="ri-arrow-up-wide-line"></i></h5>
				<div className='flex justify-between items-center w-full'>
					<h4 className='text-xl font-semibold'>4 KM away</h4>
					<button className='bg-green-400 my-2 py-1 px-10 rounded-lg text-white'>Complete Ride</button>
				</div>
			</div>

			<div ref={finishRidePanelRef} className='fixed z-10 bottom-0 w-full bg-white translate-y-full'>
				<FinishRidePopUp setfinishRidePanel={setfinishRidePanel} />
			</div>

		</div>
	)
}

export default CaptainRiding