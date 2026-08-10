import React from 'react';

const LookingForDriver = ({ setVehicleFound, pickup, destination, fare, cancelRide }) => {
    const pickupAddress = typeof pickup === 'string' ? pickup : pickup?.address || '';
    const destAddress = typeof destination === 'string' ? destination : destination?.address || '';

    return (
        <div className="p-3">
            <h5
                onClick={() => {
                    setVehicleFound(false);
                }}
                className="text-center text-3xl cursor-pointer"
            >
                <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <div className="flex items-center justify-center gap-3 py-2">
                <i className="ri-loader-4-line text-2xl animate-spin text-black"></i>
                <h2 className="text-2xl font-semibold">Looking for Nearby Captains...</h2>
            </div>

            <div className="flex flex-col justify-between items-center mt-2">
                <img
                    className="h-28 object-contain my-2 animate-pulse"
                    src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n"
                    alt="Looking for driver"
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

                {cancelRide && (
                    <button
                        onClick={cancelRide}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold w-full py-3 mt-4 rounded-xl transition-colors"
                    >
                        Cancel Search
                    </button>
                )}
            </div>
        </div>
    );
};

export default LookingForDriver;