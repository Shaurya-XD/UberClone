const captainModel = require('../models/captain.model');

exports.findNearbyCaptains = async (_pickupCoords, vehicleType) => {
    // Demo mode deliberately broadcasts by vehicle type rather than radius so
    // two accounts can demonstrate the flow from any locations worldwide.
    return captainModel.find({
        status: 'active',
        'vehicle.vehicleType': vehicleType
    });
};

exports.generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
