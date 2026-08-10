import React from 'react';

const ConfirmedRide = ({ setconfirmRidePanel, createRide, pickup, destination, fare, vehicleType }) => {
    const pickupAddress = typeof pickup === 'string' ? pickup : pickup?.address || '';
    const destAddress = typeof destination === 'string' ? destination : destination?.address || '';

    const vehicleImages = {
        car: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n',
        motorcycle: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9lZjA5NThiZC1kNDMwLTQ1ZWYtYmU2Yi0zYmZiY2JmMDYyZjYucG5n',
        auto: 'https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=0/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy80ZTcxOGQ1Yy1lNDMxLTU5YzUtYWNiNS1hYzQwYzI2YzI0ZGYud2VicA=='
    };

    return (
        <div className="p-3">
            <h5
                onClick={() => {
                    setconfirmRidePanel(false);
                }}
                className="text-center text-3xl cursor-pointer"
            >
                <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h2 className="text-center text-2xl font-semibold pb-2">Confirm your ride</h2>
            <div className="flex flex-col justify-between items-center">
                <img
                    className="h-28 object-contain my-2"
                    src={vehicleImages[vehicleType] || vehicleImages.car}
                    alt={vehicleType}
                />

                <div className="w-full">
                    <div className="flex justify-start items-center gap-5 px-5 py-3 border-b">
                        <h4 className="text-2xl text-green-600">
                            <i className="ri-map-pin-user-fill"></i>
                        </h4>
                        <div className="leading-5">
                            <h3 className="font-semibold text-gray-800">Pickup Location</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">{pickupAddress || 'Selected Pickup'}</p>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-5 px-5 py-3 border-b">
                        <h4 className="text-2xl text-red-600">
                            <i className="ri-flag-fill"></i>
                        </h4>
                        <div className="leading-5">
                            <h3 className="font-semibold text-gray-800">Destination</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">{destAddress || 'Selected Destination'}</p>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-5 px-5 py-3 border-b">
                        <h4 className="text-2xl text-emerald-600">
                            <i className="ri-money-rupee-circle-line"></i>
                        </h4>
                        <div className="leading-5">
                            <h3 className="font-semibold text-gray-900">₹{fare || 0}</h3>
                            <p className="text-sm text-gray-600">Cash Payment</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        createRide();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg w-full py-3 mt-4 rounded-xl shadow-md transition-colors"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default ConfirmedRide;