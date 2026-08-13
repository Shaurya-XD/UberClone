import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FinishRidePopUp from '../components/FinishRidePopUp';
import LiveMap from '../components/LiveMap';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { SocketDataContext } from '../context/SocketContext';

const CaptainRiding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sendMessage } = useContext(SocketDataContext);

    const [ride, setRide] = useState(location.state?.ride || null);
    const [finishRidePanel, setfinishRidePanel] = useState(false);
    const [captainLocation, setCaptainLocation] = useState(null);

    const finishRidePanelRef = useRef(null);
    const token = localStorage.getItem('captainToken') || localStorage.getItem('token');
    const authHeaders = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (!ride) {
            const fetchActive = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active`, {
                        headers: authHeaders
                    });
                    if (res.data.ride) {
                        setRide(res.data.ride);
                    }
                } catch (err) {
                    console.error('Error fetching active ride for captain:', err);
                }
            };
            fetchActive();
        }
    }, [ride]);

    // Live Geolocation Tracking
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCaptainLocation({ lat: latitude, lng: longitude });
                sendMessage('update-location', {
                    lat: latitude,
                    lng: longitude,
                    rideId: ride?._id
                });
            },
            (err) => console.warn('Geolocation warning:', err.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [ride]);

    // End Ride Action
    const handleEndRide = async () => {
        if (!ride) return;

        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
                { rideId: ride._id },
                { headers: authHeaders }
            );

            setfinishRidePanel(false);
            navigate('/captain-home');
        } catch (err) {
            console.error('Error ending ride:', err);
            alert(err.response?.data?.message || 'Failed to finish ride');
        }
    };

    useGSAP(() => {
        gsap.to(finishRidePanelRef.current, {
            transform: finishRidePanel ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [finishRidePanel]);

    const distanceKm = ride?.distance ? (ride.distance / 1000).toFixed(1) : '4.0';

    return (
        <div className="h-screen w-screen relative bg-gray-100 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="fixed left-4 top-4 z-20 flex justify-between items-center w-[calc(100%-2rem)]">
                <img className="w-20 drop-shadow-md" src="https://www.pngegg.com/en/png-pybra" alt="" />
                <Link to="/captain-home" className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md">
                    <i className="text-xl font-bold ri-home-5-fill text-gray-800"></i>
                </Link>
            </div>

            {/* Live Map */}
            <div className="h-5/6 w-full relative z-0">
                <LiveMap
                    pickupCoords={ride?.pickup}
                    destinationCoords={ride?.destination}
                    captainCoords={captainLocation}
                    routeGeometry={ride?.routeGeometry}
                />
            </div>

            {/* Complete Ride Footer Trigger */}
            <div
                onClick={() => setfinishRidePanel(true)}
                className="bg-yellow-400 h-1/6 w-full p-4 flex flex-col justify-between items-center cursor-pointer shadow-2xl z-10"
            >
                <h5 className="text-center text-3xl -mt-2 text-gray-800">
                    <i className="ri-arrow-up-wide-line"></i>
                </h5>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">{distanceKm} KM to Destination</h4>
                        <p className="text-xs text-gray-700 font-medium">Tap to finish ride & view summary</p>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 font-bold py-2.5 px-6 rounded-xl text-white shadow-md transition-colors">
                        Complete Ride
                    </button>
                </div>
            </div>

            {/* Finish Ride Popup Panel */}
            <div ref={finishRidePanelRef} className="fixed z-30 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <FinishRidePopUp
                    ride={ride}
                    endRide={handleEndRide}
                    setfinishRidePanel={setfinishRidePanel}
                />
            </div>
        </div>
    );
};

export default CaptainRiding;
