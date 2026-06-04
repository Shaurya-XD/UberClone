import React from 'react'

const CaptainDetails = () => {
	return (
		<div>
			<div className='flex items-center justify-between pb-3'>
				<div className='flex justify-start items-center gap-2'>
					<img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXT7q0gCBrxw4U8EWSBAY0r8GSlZ_2XoV2EsujtS6pToAGTSJlvj2bM4pJWFB2iM534ndLcBZtXuClo73udjO29EiBtI2OUiy0mvA38w&s=10" alt="" />
					<h4 className='text-lg font-medium'>Satoru Gojo</h4>
				</div>
				<div className='flex flex-col items-center'>
					<h4 className='text-xl font-semibold'>₹295.20</h4>
					<p className='text-sm text-gray-600'>Earned</p>
				</div>
			</div>
			<div className='flex justify-between items-center py-3 bg-gray-300 rounded-xl'>
				<div className='flex flex-col items-center'>
					<i className="text-3xl font-medium ri-timer-line"></i>
					<h5 className='text-lg font-medium'>10.2</h5>
					<p className='px-2 text-sm text-gray-600'>Hours Online</p>
				</div>
				<div className='flex flex-col items-center'>
					<i className="text-3xl font-medium ri-speed-up-line"></i>
					<h5 className='text-lg font-medium'>10.2</h5>
					<p className='px-2 text-sm text-gray-600'>Hours Online</p>
				</div>
				<div className='flex flex-col items-center'>
					<i className="text-3xl font-medium ri-booklet-line"></i>
					<h5 className='text-lg font-medium'>10.2</h5>
					<p className='px-2 text-sm text-gray-600'>Hours Online</p>
				</div>
			</div>
		</div>
	)
}

export default CaptainDetails