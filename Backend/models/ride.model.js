const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
        default: null
    },
    pickup: {
        type: locationSchema,
        required: true
    },
    destination: {
        type: locationSchema,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    otp: {
        type: String,
        select: false
    },
    distance: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    // OSRM GeoJSON LineString for the fastest driving route. Persisting it
    // keeps rider and captain maps in sync after navigation or a refresh.
    routeGeometry: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'auto'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
