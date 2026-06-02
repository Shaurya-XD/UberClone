import React from 'react'
import 'remixicon/fonts/remixicon.css'

const LocationSearchPanel = ({setvehiclePanel, setpanelOpen}) => {
	const locations = [
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, doloribus.",
		"Lorem ipsum dolor sit, amet consectetur adipisicing.",
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga ad unde sunt deserunt ex quod.",
		"Lorem ipsum dolor sit amet.",
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, mollitia? Alias, eveniet?"
	]

  return (
    <div>
			{locations.map((elem, idx) => {
				return (
					<div onClick={()=>{
						setvehiclePanel(true)
						setpanelOpen(false)
					}} key={idx} className='flex justify-start items-center active:border border-black rounded-2xl gap-2 py-1 mx-2 mb-2'>
						<h2 className='ml-3 px-2 py-1 text-xl bg-gray-200 rounded-full'><i className="ri-map-pin-line"></i></h2>
						<h4 className='font-medium'>{elem}</h4>
					</div>
				)
			})}

    </div>
  )
}

export default LocationSearchPanel 