const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { authUser, authCaptain, authRideParty } = require('../middlewares/auth.middleware');
const {
    getFareEstimate,
    getAutocomplete,
    reverseGeocode,
    createRide,
    confirmRide,
    getRideOtp,
    startRide,
    endRide,
    cancelRide,
    getActiveRide
} = require('../controllers/ride.controller');

const locationValidation = [
    body('pickup').isObject().withMessage('Pickup location is required'),
    body('destination').isObject().withMessage('Destination location is required')
];

router.post('/get-fare', authUser, locationValidation, getFareEstimate);

router.post('/autocomplete', authUser, [
    body('input').isLength({ min: 2 }).withMessage('Input must be at least 2 characters')
], getAutocomplete);

router.post('/reverse-geocode', authUser, [
    body('lat').isFloat().withMessage('Valid latitude is required'),
    body('lng').isFloat().withMessage('Valid longitude is required')
], reverseGeocode);

router.post('/create', authUser, [
    ...locationValidation,
    body('vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')
], createRide);

router.post('/confirm', authCaptain, [
    body('rideId').notEmpty().withMessage('Ride ID is required')
], confirmRide);

router.get('/otp/:rideId', authUser, [
    param('rideId').notEmpty().withMessage('Ride ID is required')
], getRideOtp);

router.post('/start-ride', authCaptain, [
    body('rideId').notEmpty().withMessage('Ride ID is required'),
    body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
], startRide);

router.post('/end-ride', authCaptain, [
    body('rideId').notEmpty().withMessage('Ride ID is required')
], endRide);

router.post('/cancel', authRideParty, [
    body('rideId').notEmpty().withMessage('Ride ID is required')
], cancelRide);

router.get('/active', authRideParty, getActiveRide);

module.exports = router;
