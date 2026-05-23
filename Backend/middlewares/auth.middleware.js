const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blacklistModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    } 

    const blacklisted = await blacklistModel.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: 'Token has been blacklisted. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded._id);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}; 

exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const blacklisted = await blacklistModel.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: 'Token has been blacklisted. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.captain = await captainModel.findById(decoded._id);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }   
};