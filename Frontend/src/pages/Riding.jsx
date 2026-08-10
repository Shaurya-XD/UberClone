import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiveMap from '../components/LiveMap';
import { SocketDataContext } from '../context/SocketContext';
import axios from 'axios';

const Riding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { socket } = useContext(SocketDataContext);

    const [ride, setRide] = useState(location.state?.ride || null);
    const [captainCoords, setCaptainCoords] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        // Fetch active ride if not present in location state
        if (!ride) {
            const fetchActive = async () => {
                try {
                    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.ride) {
                        setRide(res.data.ride);
                    }
                } catch (err) {
                    console.error('Error fetching active ride:', err);
                }
            };
            fetchActive();
        }
    }, [ride]);

    useEffect(() => {
        if (!socket) return;

        socket.on('captain-location-update', (data) => {
            if (data.location) {
                setCaptainCoords(data.location);
            }
        });

        socket.on('ride-ended', (data) => {
            setIsCompleted(true);
        });

        return () => {
            socket.off('captain-location-update');
            socket.off('ride-ended');
        };
    }, [socket]);

    const captainName = ride?.captain?.fullName
        ? `${ride.captain.fullName.firstName} ${ride.captain.fullName.lastName || ''}`
        : 'Captain';

    const vehiclePlate = ride?.captain?.vehicle?.plate || 'MH 04 AB 1234';

    return (
        <div className="h-screen w-screen relative bg-gray-100 flex flex-col justify-between overflow-hidden">
            <Link
                to="/home"
                className="fixed left-4 top-4 z-20 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-lg"
            >
                <i className="text-xl font-bold ri-home-5-fill text-gray-800"></i>
            </Link>

            {/* Live Map */}
            <div className="h-1/2 w-full relative z-0">
                <LiveMap
                    pickupCoords={ride?.pickup}
                    destinationCoords={ride?.destination}
                    captainCoords={captainCoords || ride?.captain?.vehicle?.location}
                    routeGeometry={ride?.routeGeometry}
                />
            </div>

            {/* Ride Details Card */}
            <div className="h-1/2 w-full bg-white rounded-t-3xl shadow-2xl p-5 flex flex-col justify-between z-10">
                <div>
                    <div className="flex justify-between items-center pb-3 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                className="h-14 w-14 object-cover rounded-full border-2 border-black"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmAAuoVZZwjZYKQA_oJBPSpa_-LbPcBUPuiA&s"
                                alt="Captain"
                            />
                            <div>
                                <h2 className="font-bold text-lg text-gray-900">{captainName}</h2>
                                <p className="text-xs text-gray-500 capitalize">{ride?.vehicleType || 'Ride'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h4 className="font-extrabold text-lg text-gray-900 uppercase">{vehiclePlate}</h4>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex justify-start items-center gap-4 py-2 border-b">
                            <h4 className="text-xl text-red-600">
                                <i className="ri-flag-fill"></i>
                            </h4>
                            <div className="leading-4">
                                <h3 className="font-semibold text-gray-800 text-sm">Destination</h3>
                                <p className="text-xs text-gray-600 line-clamp-1">{ride?.destination?.address || 'Destination'}</p>
                            </div>
                        </div>

                        <div className="flex justify-start items-center gap-4 py-2 border-b">
                            <h4 className="text-xl text-emerald-600">
                                <i className="ri-money-rupee-circle-line"></i>
                            </h4>
                            <div className="leading-4">
                                <h3 className="font-semibold text-gray-900 text-sm">₹{ride?.fare || 0}</h3>
                                <p className="text-xs text-gray-600">Cash</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2">
                    <i className="ri-roadster-fill text-xl"></i>
                    <span className="font-semibold text-sm">Trip in Progress... Enjoy your ride!</span>
                </div>
            </div>

            {/* Ride Complete Modal Overlay */}
            {isCompleted && (
                <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-5">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md text-center shadow-2xl">
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-3">
                            <i className="ri-checkbox-circle-fill"></i>
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Ride Completed!</h2>
                        <p className="text-sm text-gray-600 mb-4">You have arrived at your destination.</p>

                        <div className="bg-gray-100 p-4 rounded-2xl mb-5 text-left">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 text-sm">Total Fare</span>
                                <span className="text-2xl font-bold text-gray-900">₹{ride?.fare || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Payment Method</span>
                                <span>Cash</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/home')}
                            className="bg-black hover:bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl w-full text-lg transition-colors shadow-lg"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Riding;
