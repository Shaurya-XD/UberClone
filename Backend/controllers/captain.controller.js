const captainModel = require('../models/captain.model');
const blacklistModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');
const { createCaptain } = require('../services/captain.service');

exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, email, password, vehicle } = req.body;

        if(await captainModel.findOne({ email })) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        const hashedPassword = await captainModel.hashPassword(password);
        const newCaptain = await createCaptain({ firstName: fullName.firstName, lastName: fullName.lastName, email, password: hashedPassword, ...vehicle });
        const token = newCaptain.generateToken();

        res.cookie('token', token);
        res.status(201).json({ token, message: 'Captain registered successfully', captain: newCaptain });
    }
    catch (error) {
        console.error('Error registering captain:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateToken();
        res.cookie('token', token);
        res.status(200).json({ token, message: 'Login successful', captain });
    }
    catch (error) {
        console.error('Error logging in captain:', error);
        res.status(500).json({ message: 'Server error' });
    }   
};

exports.getCaptainProfile = async (req, res) => {
    res.status(200).json({ captain: req.captain });
};

exports.logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
        await blacklistModel.create({ token });
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

exports.updateCaptainLocation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { lat, lng } = req.body;

        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { 'vehicle.location.lat': lat, 'vehicle.location.lng': lng },
            { new: true }
        );

        res.status(200).json({ message: 'Location updated', captain });
    } catch (error) {
        console.error('Error updating captain location:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCaptainStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { status } = req.body;

        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { status },
            { new: true }
        );

        res.status(200).json({ message: 'Status updated', captain });
    } catch (error) {
        console.error('Error updating captain status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};