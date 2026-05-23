const captainModel = require('../models/captain.model');
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

        res.status(201).json({ token, message: 'Captain registered successfully', captain: newCaptain });
    }
    catch (error) {
        console.error('Error registering captain:', error);
        res.status(500).json({ message: 'Server error' });
    }
};