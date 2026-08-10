import React, { useState } from 'react';

const ConfirmRidePopUp = ({ ride, startRide, setconfirmRidePopUpPanel, setridePopUpPanel, error }) => {
    const [otp, setOtp] = useState('');
    const [localError, setLocalError] = useState('');

    const userName = ride?.user?.fullName
        ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName || ''}`
        : 'Rider';

    const pickupAddress = typeof ride?.pickup === 'string' ? ride.pickup : ride?.pickup?.address || '';
    const destAddress = typeof ride?.destination === 'string' ? ride.destination : ride?.destination?.address || '';
    const distanceKm = ride?.distance ? (ride.distance / 1000).toFixed(1) : '2.2';

    const submitHandler = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!otp || otp.length !== 4) {
            setLocalError('Please enter a valid 4-digit OTP');
            return;
        }

        startRide(otp);
    };

    return (
        <div className="pt-2 p-4 h-full flex flex-col justify-between overflow-y-auto">
            <div>
                <h5
                    onClick={() => {
                        setconfirmRidePopUpPanel(false);
                    }}
                    className="text-center text-3xl cursor-pointer text-gray-500"
                >
                    <i className="ri-arrow-down-wide-line"></i>
                </h5>
                <h2 className="text-center text-2xl font-bold py-1 text-gray-900">Confirm OTP to Start Ride</h2>

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
                            <p className="text-xs text-gray-600">Cash Payment</p>
                        </div>
                    </div>
                </div>
            </div>

            <form className="mt-4" onSubmit={submitHandler}>
                {(error || localError) && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-center text-sm font-semibold mb-3">
                        {error || localError}
                    </div>
                )}

                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-Digit OTP"
                    className="bg-gray-100 w-full text-center text-2xl font-extrabold tracking-widest text-black rounded-xl py-3 border-2 border-gray-300 focus:border-black focus:outline-none mb-4"
                />

                <div className="flex justify-between items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setconfirmRidePopUpPanel(false);
                            setridePopUpPanel(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl w-1/2 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl w-1/2 transition-colors shadow-md"
                    >
                        Start Ride
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConfirmRidePopUp;