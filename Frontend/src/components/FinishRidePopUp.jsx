import React from 'react';

const FinishRidePopUp = ({ ride, endRide, setfinishRidePanel }) => {
    const userName = ride?.user?.fullName
        ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName || ''}`
        : 'Rider';

    const pickupAddress = typeof ride?.pickup === 'string' ? ride.pickup : ride?.pickup?.address || '';
    const destAddress = typeof ride?.destination === 'string' ? ride.destination : ride?.destination?.address || '';
    const distanceKm = ride?.distance ? (ride.distance / 1000).toFixed(1) : '2.2';

    return (
        <div className="pb-4 p-4">
            <h5
                onClick={() => {
                    setfinishRidePanel(false);
                }}
                className="text-center text-3xl cursor-pointer text-gray-500 -mb-2"
            >
                <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Finish this Ride</h2>

            <div className="flex justify-between items-center bg-yellow-400 p-3 mx-1 my-2 rounded-2xl shadow-sm">
                <div className="flex justify-start items-center gap-3">
                    <img
                        className="h-14 w-14 object-cover rounded-full border-2 border-black"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmAAuoVZZwjZYKQA_oJBPSpa_-LbPcBUPuiA&s"
                        alt="Rider"
                    />
                    <h2 className="text-lg font-bold text-gray-900">{userName}</h2>
                </div>
                <h5 className="px-3 py-1 bg-black text-white text-sm font-bold rounded-full">{distanceKm} KM</h5>
            </div>

            <div>
                <div className="py-2">
                    <div className="flex justify-start items-center gap-4 px-4 py-3 border-b">
                        <h4 className="text-2xl text-green-600">
                            <i className="ri-map-pin-user-fill"></i>
                        </h4>
                        <div className="leading-4">
                            <h3 className="font-semibold text-gray-800 text-sm">Pickup Location</h3>
                            <p className="text-xs text-gray-600 line-clamp-1">{pickupAddress || 'Pickup Location'}</p>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-4 px-4 py-3 border-b">
                        <h4 className="text-2xl text-red-600">
                            <i className="ri-flag-fill"></i>
                        </h4>
                        <div className="leading-4">
                            <h3 className="font-semibold text-gray-800 text-sm">Destination</h3>
                            <p className="text-xs text-gray-600 line-clamp-1">{destAddress || 'Destination Location'}</p>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-4 px-4 py-3 border-b">
                        <h4 className="text-2xl text-emerald-600">
                            <i className="ri-money-rupee-circle-line"></i>
                        </h4>
                        <div className="leading-4">
                            <h3 className="font-bold text-gray-900 text-base">₹{ride?.fare || 0}</h3>
                            <p className="text-xs text-gray-600">Collect Cash Payment</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={() => {
                            endRide();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 flex justify-center rounded-xl w-full text-lg shadow-md transition-colors"
                    >
                        Finish Ride & Collect Fare
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinishRidePopUp;