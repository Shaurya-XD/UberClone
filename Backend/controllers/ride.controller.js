const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');
const { getAddressCoordinates, getDistanceAndDuration, getAutocompleteSuggestions, getAddressFromCoordinates } = require('../services/maps.service');
const { getAllFares, getFare } = require('../services/fare.service');
const { findNearbyCaptains, generateOtp } = require('../services/ride.service');
const { sendMessageToSocketId, emitToUser, emitToCaptain } = require('../utils/socket.util');

const resolveLocation = async (location) => {
    if (location.lat && location.lng) {
        return {
            address: location.address || `${location.lat}, ${location.lng}`,
            lat: location.lat,
            lng: location.lng
        };
    }

    if (location.address) {
        const coords = await getAddressCoordinates(location.address);
        return {
            address: coords.address || location.address,
            lat: coords.lat,
            lng: coords.lng
        };
    }

    throw new Error('Location must include address or coordinates');
};

const formatCaptainForRide = (captain) => ({
    _id: captain._id,
    fullName: captain.fullName,
    vehicle: captain.vehicle,
    location: captain.vehicle?.location || null
});

const formatRideResponse = (ride) => {
    const rideObj = ride.toObject ? ride.toObject() : ride;
    delete rideObj.otp;
    return rideObj;
};

exports.getFareEstimate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const pickup = await resolveLocation(req.body.pickup);
        const destination = await resolveLocation(req.body.destination);

        const route = await getDistanceAndDuration(pickup, destination);
        const fares = getAllFares(route.distance, route.duration);

        res.status(200).json({
            pickup,
            destination,
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry,
            fares
        });
    } catch (error) {
        console.error('Error getting fare estimate:', error);
        res.status(400).json({ message: error.message || 'Failed to get fare estimate' });
    }
};

exports.getAutocomplete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const suggestions = await getAutocompleteSuggestions(req.body.input);
        res.status(200).json({ suggestions });
    } catch (error) {
        console.error('Error fetching autocomplete:', error);
        res.status(400).json({ message: error.message || 'Failed to fetch suggestions' });
    }
};

exports.reverseGeocode = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const location = await getAddressFromCoordinates(req.body.lat, req.body.lng);
        res.status(200).json({ location });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Failed to resolve current location' });
    }
};

exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { vehicleType } = req.body;
        const pickup = await resolveLocation(req.body.pickup);
        const destination = await resolveLocation(req.body.destination);

        const route = await getDistanceAndDuration(pickup, destination);
        const fare = getFare(route.distance, route.duration, vehicleType);
        const otp = generateOtp();

        const ride = await rideModel.create({
            user: req.user._id,
            pickup,
            destination,
            fare,
            distance: route.distance,
            duration: route.duration,
            routeGeometry: route.geometry,
            vehicleType,
            otp,
            status: 'pending'
        });

        const populatedRide = await rideModel.findById(ride._id).populate('user', 'fullName email socketId');
        const nearbyCaptains = await findNearbyCaptains(pickup, vehicleType);

        const ridePayload = {
            ride: formatRideResponse(populatedRide),
            user: {
                _id: req.user._id,
                fullName: req.user.fullName
            }
        };

        nearbyCaptains.forEach((captain) => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, 'new-ride-request', ridePayload);
            }
        });

        res.status(201).json({
            message: 'Ride created successfully',
            ride: formatRideResponse(populatedRide),
            geometry: route.geometry,
            captainsNotified: nearbyCaptains.length
        });
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(400).json({ message: error.message || 'Failed to create ride' });
    }
};

exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        const ride = await rideModel.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'pending') {
            return res.status(400).json({ message: 'Ride is no longer available' });
        }

        if (ride.vehicleType !== req.captain.vehicle.vehicleType) {
            return res.status(400).json({ message: 'Vehicle type does not match ride request' });
        }

        ride.captain = req.captain._id;
        ride.status = 'accepted';
        await ride.save();

        await captainModel.findByIdAndUpdate(req.captain._id, { status: 'active' });

        const populatedRide = await rideModel.findById(rideId)
            .populate('user', 'fullName email socketId')
            .populate('captain', 'fullName vehicle socketId');

        await emitToUser(ride.user, 'ride-accepted', {
            ride: formatRideResponse(populatedRide),
            captain: formatCaptainForRide(populatedRide.captain)
        });

        res.status(200).json({
            message: 'Ride accepted successfully',
            ride: formatRideResponse(populatedRide)
        });
    } catch (error) {
        console.error('Error confirming ride:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRideOtp = async (req, res) => {
    try {
        const ride = await rideModel.findById(req.params.rideId).select('+otp');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this OTP' });
        }

        if (!['accepted', 'ongoing'].includes(ride.status)) {
            return res.status(400).json({ message: 'OTP is not available for this ride status' });
        }

        res.status(200).json({ otp: ride.otp });
    } catch (error) {
        console.error('Error fetching OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId, otp } = req.body;
        const ride = await rideModel.findById(rideId).select('+otp');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (!ride.captain || ride.captain.toString() !== req.captain._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to start this ride' });
        }

        if (ride.status !== 'accepted') {
            return res.status(400).json({ message: 'Ride cannot be started in its current status' });
        }

        if (ride.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        ride.status = 'ongoing';
        await ride.save();

        const populatedRide = await rideModel.findById(rideId)
            .populate('user', 'fullName email socketId')
            .populate('captain', 'fullName vehicle socketId');

        await emitToUser(ride.user, 'ride-started', {
            ride: formatRideResponse(populatedRide)
        });

        res.status(200).json({
            message: 'Ride started successfully',
            ride: formatRideResponse(populatedRide)
        });
    } catch (error) {
        console.error('Error starting ride:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        const ride = await rideModel.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (!ride.captain || ride.captain.toString() !== req.captain._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to end this ride' });
        }

        if (ride.status !== 'ongoing') {
            return res.status(400).json({ message: 'Ride is not ongoing' });
        }

        ride.status = 'completed';
        await ride.save();

        const populatedRide = await rideModel.findById(rideId)
            .populate('user', 'fullName email socketId')
            .populate('captain', 'fullName vehicle socketId');

        await emitToUser(ride.user, 'ride-ended', { ride: formatRideResponse(populatedRide) });
        await emitToCaptain(ride.captain, 'ride-ended', { ride: formatRideResponse(populatedRide) });

        res.status(200).json({
            message: 'Ride completed successfully',
            ride: formatRideResponse(populatedRide)
        });
    } catch (error) {
        console.error('Error ending ride:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rideId } = req.body;
        const ride = await rideModel.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        const isUserOwner = req.user && ride.user.toString() === req.user._id.toString();
        const isAssignedCaptain = req.captain && ride.captain
            && ride.captain.toString() === req.captain._id.toString();

        if (isUserOwner) {
            if (!['pending', 'accepted'].includes(ride.status)) {
                return res.status(403).json({ message: 'Not authorized to cancel this ride' });
            }
        } else if (isAssignedCaptain) {
            if (!['accepted', 'ongoing'].includes(ride.status)) {
                return res.status(403).json({ message: 'Not authorized to cancel this ride' });
            }
        } else {
            return res.status(403).json({ message: 'Not authorized to cancel this ride' });
        }

        if (['completed', 'cancelled'].includes(ride.status)) {
            return res.status(400).json({ message: 'Ride cannot be cancelled' });
        }

        ride.status = 'cancelled';
        await ride.save();

        const populatedRide = await rideModel.findById(rideId)
            .populate('user', 'fullName email socketId')
            .populate('captain', 'fullName vehicle socketId');

        const payload = {
            ride: formatRideResponse(populatedRide),
            cancelledBy: req.user ? 'user' : 'captain'
        };

        await emitToUser(ride.user, 'ride-cancelled', payload);
        if (ride.captain) {
            await emitToCaptain(ride.captain, 'ride-cancelled', payload);
        }

        res.status(200).json({
            message: 'Ride cancelled successfully',
            ride: formatRideResponse(populatedRide)
        });
    } catch (error) {
        console.error('Error cancelling ride:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getActiveRide = async (req, res) => {
    try {
        let ride;

        if (req.user) {
            ride = await rideModel.findOne({
                user: req.user._id,
                status: { $in: ['pending', 'accepted', 'ongoing'] }
            }).populate('captain', 'fullName vehicle').sort({ createdAt: -1 });
        } else if (req.captain) {
            ride = await rideModel.findOne({
                captain: req.captain._id,
                status: { $in: ['accepted', 'ongoing'] }
            }).populate('user', 'fullName email').sort({ createdAt: -1 });
        }

        res.status(200).json({ ride: ride ? formatRideResponse(ride) : null });
    } catch (error) {
        console.error('Error fetching active ride:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
