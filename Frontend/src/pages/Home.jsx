import React, { useRef, useState, useEffect, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehicleSearchPanel from '../components/VehicleSearchPanel';
import ConfirmedRide from '../components/ConfirmedRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveMap from '../components/LiveMap';
import { SocketDataContext } from '../context/SocketContext';

const Home = () => {
    const navigate = useNavigate();
    const { socket, receiveMessage } = useContext(SocketDataContext);

    const panelRef = useRef(null);
    const sliderRef = useRef(null);
    const vehiclePanelRef = useRef(null);
    const confirmPanelRef = useRef(null);
    const VehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);

    const [pickUp, setpickUp] = useState('');
    const [destination, setdestination] = useState('');
    const [pickupCoords, setpickupCoords] = useState(null);
    const [destinationCoords, setdestinationCoords] = useState(null);
    const [captainCoords, setcaptainCoords] = useState(null);
    const [routeGeometry, setrouteGeometry] = useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState('pickup'); // 'pickup' or 'destination'
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const [panelOpen, setpanelOpen] = useState(false);
    const [vehiclePanel, setvehiclePanel] = useState(false);
    const [confirmRidePanel, setconfirmRidePanel] = useState(false);
    const [VehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setwaitingForDriver] = useState(false);

    const [fares, setFares] = useState({});
    const [selectedVehicleType, setSelectedVehicleType] = useState('car');
    const [currentRide, setCurrentRide] = useState(null);
    const [captainInfo, setCaptainInfo] = useState(null);
    const [otp, setOtp] = useState('');

    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Debounced Autocomplete
    useEffect(() => {
        const query = activeField === 'pickup' ? pickUp : destination;
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/rides/autocomplete`,
                    { input: query },
                    { headers: authHeaders }
                );
                setSuggestions(response.data.suggestions || []);
            } catch (err) {
                console.error('Autocomplete error:', err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [pickUp, destination, activeField]);

    // Calculate Fares & Route when both pickup and destination exist
    const fetchFaresAndRoute = async (pickupVal, destVal) => {
        if (!pickupVal || !destVal) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
                {
                    pickup: typeof pickupVal === 'string' ? { address: pickupVal } : pickupVal,
                    destination: typeof destVal === 'string' ? { address: destVal } : destVal
                },
                { headers: authHeaders }
            );

            const { fares: fareResults, geometry, pickup, destination: dest } = response.data;
            setFares(fareResults);
            setrouteGeometry(geometry);
            if (pickup) setpickupCoords(pickup);
            if (dest) setdestinationCoords(dest);

            setvehiclePanel(true);
            setpanelOpen(false);
        } catch (err) {
            console.error('Failed to get fare estimate:', err);
            alert(err.response?.data?.message || 'Failed to estimate fare');
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        if (activeField === 'pickup') {
            setpickUp(suggestion.address);
            setpickupCoords({ address: suggestion.address, lat: suggestion.lat, lng: suggestion.lng });
            if (destination) {
                fetchFaresAndRoute(suggestion, destinationCoords || destination);
            }
        } else {
            setdestination(suggestion.address);
            setdestinationCoords({ address: suggestion.address, lat: suggestion.lat, lng: suggestion.lng });
            if (pickUp) {
                fetchFaresAndRoute(pickupCoords || pickUp, suggestion);
            }
        }
        setSuggestions([]);
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Your browser does not support location services.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const location = { lat: coords.latitude, lng: coords.longitude };
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/rides/reverse-geocode`,
                        location,
                        { headers: authHeaders }
                    );
                    const resolvedLocation = response.data.location || location;
                    setpickUp(resolvedLocation.address);
                    setpickupCoords(resolvedLocation);
                    setActiveField('pickup');
                    setSuggestions([]);
                    if (destination) fetchFaresAndRoute(resolvedLocation, destinationCoords || destination);
                } catch (err) {
                    // The coordinate fallback still lets a rider request a ride.
                    const fallback = { ...location, address: 'Current location' };
                    setpickUp(fallback.address);
                    setpickupCoords(fallback);
                    if (destination) fetchFaresAndRoute(fallback, destinationCoords || destination);
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                setIsLocating(false);
                alert(error.code === error.PERMISSION_DENIED
                    ? 'Location permission was denied. Enter a pickup location instead.'
                    : 'Could not determine your location. Please try again.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    };

    // Socket Event Listeners for Rider
    useEffect(() => {
        if (!socket) return;

        socket.on('ride-accepted', async (data) => {
            console.log('Ride accepted:', data);
            setCurrentRide(data.ride);
            setCaptainInfo(data.captain);
            if (data.captain?.location) {
                setcaptainCoords(data.captain.location);
            }
            setVehicleFound(false);
            setwaitingForDriver(true);

            // Fetch OTP
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/rides/otp/${data.ride._id}`,
                    { headers: authHeaders }
                );
                setOtp(res.data.otp);
            } catch (err) {
                console.error('Error fetching OTP:', err);
            }
        });

        socket.on('captain-location-update', (data) => {
            if (data.location) {
                setcaptainCoords(data.location);
            }
        });

        socket.on('ride-started', (data) => {
            console.log('Ride started:', data);
            setwaitingForDriver(false);
            navigate('/riding', { state: { ride: data.ride } });
        });

        socket.on('ride-cancelled', (data) => {
            alert('Ride was cancelled.');
            setVehicleFound(false);
            setwaitingForDriver(false);
            setconfirmRidePanel(false);
            setvehiclePanel(false);
            setCurrentRide(null);
        });

        return () => {
            socket.off('ride-accepted');
            socket.off('captain-location-update');
            socket.off('ride-started');
            socket.off('ride-cancelled');
        };
    }, [socket]);

    // Create Ride Action
    const handleCreateRide = async () => {
        try {
            const payload = {
                pickup: pickupCoords || { address: pickUp },
                destination: destinationCoords || { address: destination },
                vehicleType: selectedVehicleType
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/create`,
                payload,
                { headers: authHeaders }
            );

            setCurrentRide(response.data.ride);
            setconfirmRidePanel(false);
            setVehicleFound(true);
        } catch (err) {
            console.error('Error creating ride:', err);
            alert(err.response?.data?.message || 'Failed to request ride');
        }
    };

    // Cancel Ride Action
    const handleCancelRide = async () => {
        if (!currentRide) return;
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
                { rideId: currentRide._id },
                { headers: authHeaders }
            );
            setVehicleFound(false);
            setwaitingForDriver(false);
            setCurrentRide(null);
        } catch (err) {
            console.error('Error cancelling ride:', err);
        }
    };

    // GSAP Animations
    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, { height: '75%' });
            gsap.to(sliderRef.current, { opacity: 1 });
        } else {
            gsap.to(panelRef.current, { height: '0%' });
            gsap.to(sliderRef.current, { opacity: 0 });
        }
    }, [panelOpen]);

    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, {
            transform: vehiclePanel ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [vehiclePanel]);

    useGSAP(() => {
        gsap.to(confirmPanelRef.current, {
            transform: confirmRidePanel ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [confirmRidePanel]);

    useGSAP(() => {
        gsap.to(VehicleFoundRef.current, {
            transform: VehicleFound ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [VehicleFound]);

    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, {
            transform: waitingForDriver ? 'translateY(0%)' : 'translateY(100%)'
        });
    }, [waitingForDriver]);

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
            {/* Uber Logo */}
            <img
                className="w-20 absolute left-4 top-4 z-20 drop-shadow-md pointer-events-none"
                src="https://in.pinterest.com/pin/cars-silhouette-png-images-vector-car-icon-car-icons-car-clipart-png-car-png-image-for-free-download--252131279126621666/"
                alt=""
            />

            {/* Interactive Live Map */}
            <div className="h-screen w-screen absolute inset-0 z-0">
                <LiveMap
                    pickupCoords={pickupCoords}
                    destinationCoords={destinationCoords}
                    captainCoords={captainCoords}
                    routeGeometry={routeGeometry}
                />
            </div>

            {/* Bottom Panels Container */}
            <div className="absolute top-0 w-screen h-screen flex flex-col justify-end z-10 pointer-events-none">
                <div className="h-auto bg-white p-5 relative rounded-t-3xl shadow-2xl pointer-events-auto">
                    <h5
                        ref={sliderRef}
                        onClick={() => setpanelOpen(false)}
                        className="absolute text-3xl top-2 left-[46%] cursor-pointer text-gray-500"
                    >
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className="text-xl font-bold mb-4 text-gray-900 text-center">Book a Ride</h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchFaresAndRoute(pickupCoords || pickUp, destinationCoords || destination);
                        }}
                    >
                        <div className="line absolute h-14 w-1 top-20 left-9 bg-gray-900 rounded-full"></div>
                        <input
                            value={pickUp}
                            className="bg-gray-100 w-full text-black font-medium rounded-xl px-10 py-3 mb-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                            type="text"
                            placeholder="Add a pick-up location"
                            onChange={(e) => setpickUp(e.target.value)}
                            onFocus={() => {
                                setActiveField('pickup');
                                setpanelOpen(true);
                            }}
                        />
                        <button
                            type="button"
                            onClick={useCurrentLocation}
                            disabled={isLocating}
                            className="-mt-1 mb-3 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-wait disabled:opacity-60"
                        >
                            <i className={`mr-2 ${isLocating ? 'ri-loader-4-line animate-spin' : 'ri-crosshair-2-line'}`}></i>
                            {isLocating ? 'Finding your location…' : 'Use my current location for pickup'}
                        </button>
                        <input
                            value={destination}
                            className="bg-gray-100 w-full text-black font-medium rounded-xl px-10 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                            type="text"
                            placeholder="Enter your destination"
                            onChange={(e) => setdestination(e.target.value)}
                            onFocus={() => {
                                setActiveField('destination');
                                setpanelOpen(true);
                            }}
                        />
                    </form>
                </div>

                <div ref={panelRef} className="h-0 bg-white shadow-inner overflow-hidden pointer-events-auto">
                    <LocationSearchPanel
                        suggestions={suggestions}
                        onSelectSuggestion={handleSelectSuggestion}
                        loading={isSearching}
                    />
                </div>
            </div>

            {/* Vehicle Selection Panel */}
            <div ref={vehiclePanelRef} className="fixed z-20 bottom-0 w-full p-4 bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <VehicleSearchPanel
                    fares={fares}
                    selectVehicle={(vType) => setSelectedVehicleType(vType)}
                    setconfirmRidePanel={setconfirmRidePanel}
                    setvehiclePanel={setvehiclePanel}
                />
            </div>

            {/* Confirm Ride Panel */}
            <div ref={confirmPanelRef} className="fixed z-20 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <ConfirmedRide
                    pickup={pickUp}
                    destination={destination}
                    fare={fares[selectedVehicleType]}
                    vehicleType={selectedVehicleType}
                    createRide={handleCreateRide}
                    setconfirmRidePanel={setconfirmRidePanel}
                />
            </div>

            {/* Searching for Captain Panel */}
            <div ref={VehicleFoundRef} className="fixed z-20 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <LookingForDriver
                    pickup={pickUp}
                    destination={destination}
                    fare={fares[selectedVehicleType]}
                    cancelRide={handleCancelRide}
                    setVehicleFound={setVehicleFound}
                />
            </div>

            {/* Waiting for Captain / OTP Panel */}
            <div ref={waitingForDriverRef} className="fixed z-20 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl translate-y-full">
                <WaitingForDriver
                    ride={currentRide}
                    captain={captainInfo}
                    otp={otp}
                    setwaitingForDriver={setwaitingForDriver}
                />
            </div>
        </div>
    );
};

export default Home;
