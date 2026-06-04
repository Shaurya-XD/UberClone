import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'

const CaptainHome = () => {
  const [ridePopUpPanel, setridePopUpPanel] = useState(true)
  const [confirmRidePopUpPanel, setconfirmRidePopUpPanel] = useState(false)

  const confirmRidePopUpPanelRef = useRef(null)
  const ridePopUpPanelRef = useRef(null)

  useGSAP(()=>{
    if(ridePopUpPanel){
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(0%)'
      })
    }else{
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [ridePopUpPanel])

  useGSAP(()=>{
    if(confirmRidePopUpPanel){
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(0%)'
      })
    }else{
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePopUpPanel])

  return (
    <div className='h-screen w-screen'>
			<div className='fixed left-3 top-3 flex justify-between items-center w-full' >
        <img className='w-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full mr-5'>
          <i className="text-lg font-medium ri-logout-box-fill"></i>
        </Link>
      </div>
      <div className='h-4/6 w-full'>
        <img
          className='object-cover h-full w-full'
          src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
          alt=""
        />
      </div>

      <div className='h-2/6 w-full p-4'>
        <CaptainDetails/>
      </div>

      <div ref={ridePopUpPanelRef} className='fixed z-10 bottom-0 w-full bg-white translate-y-full'>
        <RidePopUp setconfirmRidePopUpPanel={setconfirmRidePopUpPanel} setridePopUpPanel={setridePopUpPanel} />
      </div>

      <div ref={confirmRidePopUpPanelRef} className='fixed z-10 bottom-0 w-full bg-white translate-y-full'>
        <ConfirmRidePopUp setridePopUpPanel={setridePopUpPanel} setconfirmRidePopUpPanel={setconfirmRidePopUpPanel} />
      </div>

    </div>
  )
}

export default CaptainHome