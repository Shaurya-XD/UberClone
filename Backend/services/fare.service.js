// Rate tables — tune pricing here
const FARE_RATES = {
    car: {
        baseFare: 50,
        perKmRate: 12,
        perMinuteRate: 2
    },
    motorcycle: {
        baseFare: 25,
        perKmRate: 6,
        perMinuteRate: 1
    },
    auto: {
        baseFare: 35,
        perKmRate: 8,
        perMinuteRate: 1.5
    }
};

const VEHICLE_TYPES = ['car', 'motorcycle', 'auto'];

exports.getFare = (distanceInMeters, durationInSeconds, vehicleType) => {
    const rates = FARE_RATES[vehicleType];
    if (!rates) {
        throw new Error('Invalid vehicle type');
    }

    const distanceKm = distanceInMeters / 1000;
    const durationMinutes = durationInSeconds / 60;

    const fare = rates.baseFare
        + (distanceKm * rates.perKmRate)
        + (durationMinutes * rates.perMinuteRate);

    return Math.round(fare);
};

exports.getAllFares = (distanceInMeters, durationInSeconds) => {
    const fares = {};

    VEHICLE_TYPES.forEach((vehicleType) => {
        fares[vehicleType] = exports.getFare(distanceInMeters, durationInSeconds, vehicleType);
    });

    return fares;
};

exports.VEHICLE_TYPES = VEHICLE_TYPES;
