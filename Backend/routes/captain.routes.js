const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain, updateCaptainLocation, updateCaptainStatus } = require('../controllers/captain.controller');
const { authCaptain } = require('../middlewares/auth.middleware');

router.post('/register', [
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'), 
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate number must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be car, motorcycle, or auto')
], registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
], loginCaptain);

router.get('/profile', authCaptain, getCaptainProfile);

router.get('/logout', authCaptain, logoutCaptain);

router.put('/location', authCaptain, [
    body('lat').isFloat().withMessage('Valid latitude is required'),
    body('lng').isFloat().withMessage('Valid longitude is required')
], updateCaptainLocation);

router.put('/status', authCaptain, [
    body('status').isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
], updateCaptainStatus);

module.exports = router;