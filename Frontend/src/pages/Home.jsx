import React, { useRef, useState } from 'react'
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehicleSearchPanel from '../components/VehicleSearchPanel';
import ConfirmedRide from '../components/ConfirmedRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';

const Home = () => {
  const panelRef = useRef(null)
  const sliderRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmPanelRef = useRef(null)
  const VehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const [pickUp, setpickUp] = useState('')
  const [destination, setdestination] = useState('')
  const [panelOpen, setpanelOpen] = useState(false)
  const [vehiclePanel, setvehiclePanel] = useState(false)
  const [confirmRidePanel, setconfirmRidePanel] = useState(false)
  const [VehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setwaitingForDriver] = useState(false)

  const submitHandler = (e) =>{
    e.preventDefault();

  }

  useGSAP(()=>{
    if(panelOpen){ 
      gsap.to(panelRef.current, {
        height: '75%',
      })
      gsap.to(sliderRef.current, {
        opacity: 1
      })
    }else{
      gsap.to(panelRef.current, {
        height: '0%'
      })
      gsap.to(sliderRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(()=>{
    if(vehiclePanel){
      gsap.to(vehiclePanelRef.current, { 
        transform: 'translateY(0%)'
      })
    }else{
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(()=>{
    if(confirmRidePanel){
      gsap.to(confirmPanelRef.current, { 
        transform: 'translateY(0%)'
      })
    }else{
      gsap.to(confirmPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(()=>{
    if(VehicleFound){
      gsap.to(VehicleFoundRef.current, { 
        transform: 'translateY(0%)'
      })
    }else{
      gsap.to(VehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [VehicleFound])

  useGSAP(()=>{
    if(waitingForDriver){
      gsap.to(waitingForDriverRef.current, { 
        transform: 'translateY(0%)'
      })
    }else{
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <img className='w-20 absolute left-3 top-3' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />

      <div className='h-screen w-screen'>
        <img className='object-cover h-full w-full' src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" alt="" />
      </div>
      <div className='absolute top-0 w-screen h-screen flex flex-col justify-end'>
        
        <div className='h-1/4 bg-white p-5 relative'>
          <h5 ref={sliderRef} onClick={()=>{
            setpanelOpen(false);
          }} className='absolute text-3xl top-0 left-[46%]'><i className="ri-arrow-down-wide-line "></i></h5>
          <h4 className='text-2xl font-semibold mb-2 text-center'>Make a trip</h4>
          <form onSubmit={(e)=>{
            submitHandler(e);
          }}>
            <div className='line absolute h-14 w-1 bottom-9 left-9 bg-gray-600 rounded-full'></div>
            <input value={pickUp} className='bg-gray-200 w-full text-black rounded-lg px-10 py-1.5 mb-4' type="text" placeholder='Add a pick-up location' onChange={(e) => {
              setpickUp(e.target.value)
            }} 
            onClick={()=>{
              setpanelOpen(true)
            }}/>
            <input value={destination} className='bg-gray-200 w-full text-black rounded-lg px-10 py-1.5' type="text" placeholder='Enter your destination' onChange={(e)=>{
              setdestination(e.target.value)
            }} 
            onClick={()=>{
              setpanelOpen(true)
            }}/>
          </form>
        </div>
        <div ref={panelRef} className='h-3/4 bg-white'>
            <LocationSearchPanel setpanelOpen={setpanelOpen} setvehiclePanel={setvehiclePanel} />
        </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed z-10 bottom-0 w-full p-3 bg-white translate-y-full'>
        <VehicleSearchPanel setconfirmRidePanel={setconfirmRidePanel} setvehiclePanel={setvehiclePanel}/>
      </div>

      <div ref={confirmPanelRef} className='fixed z-10 bottom-0 w-full bg-white translate-y-full'>
        <ConfirmedRide setVehicleFound={setVehicleFound} setconfirmRidePanel={setconfirmRidePanel}/>
      </div>

      <div ref={VehicleFoundRef} className='fixed z-10 bottom-0 w-full bg-white translate-y-full'>
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div ref={waitingForDriverRef} className='fixed z-10 bottom-0 w-full bg-white '>
        <WaitingForDriver setwaitingForDriver={setwaitingForDriver}/>
      </div>
    </div>
  )
}

export default Home