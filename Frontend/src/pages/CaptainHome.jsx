import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import LiveMap from '../components/LiveMap';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { SocketDataContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainHome = () => {
    const navigate = useNavigate();
    const { socket, sendMessage } = useContext(SocketDataContext);
    const { captain, setcaptain } = useContext(CaptainDataContext);

    const [ridePopUpPanel, setridePopUpPanel] = useState(false);
    const [confirmRidePopUpPanel, setconfirmRidePopUpPanel] = useState(false);

    const confirmRidePopUpPanelRef = useRef(null);
    const ridePopUpPanelRef = useRef(null);

    const [currentRide, setCurrentRide] = useState(null);
    const [captainLocation, setCaptainLocation] = useState(null);
    const [otpError, setOtpError] = useState('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const availabilityInitialized = useRef(false);

    const token = localStorage.getItem('captainToken') || localStorage.getItem('token');
    const authHeaders = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const savedLocation = captain?.vehicle?.location;
        if (savedLocation?.lat != null && savedLocation?.lng != null) {
            setCaptainLocation(savedLocation);
        }
    }, [captain]);

    const setOnlineStatus = async (online) => {
        setIsUpdatingStatus(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/captains/status`,
                { status: online ? 'active' : 'inactive' },
                { headers: authHeaders }
            );
            setcaptain(response.data.captain);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not update availability');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // A captain opening the dashboard is available by default in demo mode.
    // They can still use the toggle to go offline afterwards.
    useEffect(() => {
        if (captain && !availabilityInitialized.current && captain.status !== 'active') {
            availabilityInitialized.current = true;
            setOnlineStatus(true);
        }
    }, [captain]);

    // Watch Geolocation & Emit Captain Location
    useEffect(() => {
        if (!navigator.geolocation) return;

        const updateLocationBackend = async (lat, lng) => {
            setCaptainLocation({ lat, lng });
            sendMessage('update-location', {
                lat,
                lng,
                rideId: currentRide?._id
            });

            try {
                await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/captains/location`,
                    { lat, lng },
                    { headers: authHeaders }
                );
            } catch (err) {
                console.error('Location update error:', err);
            }
        };

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                updateLocationBackend(latitude, longitude);
            },
            (err) => console.warn('Geolocation warning:', err.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [currentRide]);

    // Socket Listener for Incoming Ride Requests
    useEffect(() => {
        if (!socket) return;

        socket.on('new-ride-request', (data) => {
            console.log('Incoming ride request:', data);
            setCurrentRide(data.ride);
            setridePopUpPanel(true);
        });

        socket.on('ride-cancelled', () => {
            alert('Ride was cancelled by user.');
            setridePopUpPanel(false);
            setconfirmRidePopUpPanel(false);
            setCurrentRide(null);
        });

        return () => {
            socket.off('new-ride-request');
            socket.off('ride-cancelled');
        };
    }, [socket]);

    // Confirm Ride (Captain accepts)
    const handleConfirmRide = async () => {
        if (!currentRide) return;
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                { rideId: currentRide._id },
                { headers: authHeaders }
            );

            setCurrentRide(res.data.ride);
            setridePopUpPanel(false);
            setconfirmRidePopUpPanel(true);
        } catch (err) {
            console.error('Error confirming ride:', err);
            alert(err.response?.data?.message || 'Failed to accept ride');
        }
    };

    // Start Ride (Captain submits OTP)
    const handleStartRide = async (otp) => {
        if (!currentRide) return;
        setOtpError('');

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                { rideId: currentRide._id, otp },
                { headers: authHeaders }
            );

            setconfirmRidePopUpPanel(false);
            navigate('/captain-riding', { state: { ride: res.data.ride } });
        } catch (err) {
            console.error('Error starting ride:', err);
            setOtpError(err.response?.data?.message || 'Invalid OTP. Please check with rider.');
        }
    };

    // GSAP Animations
    useGSAP(() => {
        gsap.to(ridePopUpPanelRef.current, {
            transform: ridePopUpPanel ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [ridePopUpPanel]);

    useGSAP(() => {
        gsap.to(confirmRidePopUpPanelRef.current, {
            transform: confirmRidePopUpPanel ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [confirmRidePopUpPanel]);

    return (
        <div className="h-screen w-screen relative bg-gray-100 overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="fixed left-4 top-4 z-20 flex justify-between items-center w-[calc(100%-2rem)]">
                <img className="w-20 drop-shadow-md" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link to="/captain/logout" className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md">
                    <i className="text-xl font-bold ri-logout-box-r-line text-gray-800"></i>
                </Link>
            </div>

            {/* Live Map */}
            <div className="h-4/6 w-full relative z-0">
                <LiveMap
                    captainCoords={captainLocation}
                    pickupCoords={currentRide?.pickup}
                    destinationCoords={currentRide?.destination}
                    routeGeometry={currentRide?.routeGeometry}
                />
            </div>

            {/* Captain Details Footer */}
            <div className="h-2/6 w-full bg-white rounded-t-3xl shadow-2xl p-4 z-10 overflow-y-auto">
                <CaptainDetails
                    captain={captain}
                    location={captainLocation}
                    isOnline={captain?.status === 'active'}
                    onStatusChange={setOnlineStatus}
                    disabled={isUpdatingStatus}
                />
            </div>

            {/* Incoming Ride Request Popup */}
            <div ref={ridePopUpPanelRef} className="fixed z-30 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <RidePopUp
                    ride={currentRide}
                    confirmRide={handleConfirmRide}
                    setconfirmRidePopUpPanel={setconfirmRidePopUpPanel}
                    setridePopUpPanel={setridePopUpPanel}
                />
            </div>

            {/* Confirm Ride / OTP Entry Popup */}
            <div ref={confirmRidePopUpPanelRef} className="fixed z-30 bottom-0 w-full h-full bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <ConfirmRidePopUp
                    ride={currentRide}
                    startRide={handleStartRide}
                    error={otpError}
                    setridePopUpPanel={setridePopUpPanel}
                    setconfirmRidePopUpPanel={setconfirmRidePopUpPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;
