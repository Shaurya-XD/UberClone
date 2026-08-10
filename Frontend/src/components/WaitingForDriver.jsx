import React from 'react';

const WaitingForDriver = ({ setwaitingForDriver, ride, captain, otp }) => {
    const captainName = captain?.fullName
        ? `${captain.fullName.firstName} ${captain.fullName.lastName || ''}`
        : 'Captain Assigned';

    const vehiclePlate = captain?.vehicle?.plate || 'MH 04 AB 1234';
    const vehicleColor = captain?.vehicle?.color || '';
    const vehicleType = captain?.vehicle?.vehicleType || 'Car';
    const pickupAddress = typeof ride?.pickup === 'string' ? ride.pickup : ride?.pickup?.address || '';
    const destAddress = typeof ride?.destination === 'string' ? ride.destination : ride?.destination?.address || '';

    return (
        <div className="p-3">
            <h5
                onClick={() => {
                    setwaitingForDriver(false);
                }}
                className="text-center text-3xl cursor-pointer"
            >
                <i className="ri-arrow-down-wide-line"></i>
            </h5>

            {/* OTP Banner */}
            <div className="bg-yellow-400 rounded-xl p-3 my-2 text-center shadow-sm">
                <p className="text-xs font-bold text-gray-800 tracking-wider uppercase">Share OTP with Captain to Start Trip</p>
                <h1 className="text-4xl font-extrabold tracking-widest text-gray-900 mt-1">{otp || '----'}</h1>
            </div>

            {/* Captain & Vehicle Card */}
            <div className="w-full flex justify-between items-center bg-gray-50 rounded-xl p-3 border my-2">
                <div className="flex items-center gap-3">
                    <img
                        className="h-16 w-16 object-cover rounded-full border-2 border-black"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmAAuoVZZwjZYKQA_oJBPSpa_-LbPcBUPuiA&s"
                        alt="Captain"
                    />
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{captainName}</h2>
                        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full capitalize">{vehicleType}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <h4 className="font-extrabold text-lg text-gray-900 uppercase tracking-wider">{vehiclePlate}</h4>
                    <p className="text-xs text-gray-600 capitalize">{vehicleColor}</p>
                </div>
            </div>

            {/* Trip Details */}
            <div className="w-full mt-2">
                <div className="flex justify-start items-center gap-5 px-4 py-3 border-b">
                    <h4 className="text-2xl text-green-600">
                        <i className="ri-map-pin-user-fill"></i>
                    </h4>
                    <div className="leading-5">
                        <h3 className="font-semibold text-gray-800">Pickup Location</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{pickupAddress || 'Pickup Location'}</p>
                    </div>
                </div>
                <div className="flex justify-start items-center gap-5 px-4 py-3 border-b">
                    <h4 className="text-2xl text-red-600">
                        <i className="ri-flag-fill"></i>
                    </h4>
                    <div className="leading-5">
                        <h3 className="font-semibold text-gray-800">Destination</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{destAddress || 'Destination Location'}</p>
                    </div>
                </div>
                <div className="flex justify-start items-center gap-5 px-4 py-3 border-b">
                    <h4 className="text-2xl text-emerald-600">
                        <i className="ri-money-rupee-circle-line"></i>
                    </h4>
                    <div className="leading-5">
                        <h3 className="font-semibold text-gray-900">₹{ride?.fare || 0}</h3>
                        <p className="text-sm text-gray-600">Cash Payment</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingForDriver;