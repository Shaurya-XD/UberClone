const axios = require('axios');

// Nominatim usage policy: max ~1 request/second. Use cache and avoid hammering public servers.
// https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_BASE_URL = process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
const OSRM_BASE_URL = process.env.OSRM_BASE_URL || 'https://router.project-osrm.org';
const NOMINATIM_USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'UberClone/1.0 (ride-booking-app)';

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map();

const getCacheKey = (prefix, key) => `${prefix}:${key}`;

const getFromCache = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.value;
};

const setCache = (key, value) => {
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
};

const nominatimClient = axios.create({
    baseURL: NOMINATIM_BASE_URL,
    headers: {
        'User-Agent': NOMINATIM_USER_AGENT
    },
    timeout: 10000
});

const osrmClient = axios.create({
    baseURL: OSRM_BASE_URL,
    timeout: 10000
});

exports.getAddressCoordinates = async (address) => {
    const cacheKey = getCacheKey('geocode', address.toLowerCase().trim());
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    try {
        const { data } = await nominatimClient.get('/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            }
        });

        if (!data || data.length === 0) {
            throw new Error('Address not found');
        }

        const result = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            address: data[0].display_name
        };

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message || 'Failed to geocode address');
    }
};

exports.getAutocompleteSuggestions = async (input) => {
    const cacheKey = getCacheKey('autocomplete', input.toLowerCase().trim());
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    try {
        const { data } = await nominatimClient.get('/search', {
            params: {
                q: input,
                format: 'json',
                addressdetails: 1,
                namedetails: 1,
                extratags: 1,
                dedupe: 1,
                limit: 8
            }
        });

        const suggestions = (data || []).map((item) => ({
            address: item.display_name,
            name: item.namedetails?.name || item.name || item.display_name.split(',')[0],
            type: item.type || item.class,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
        }));

        setCache(cacheKey, suggestions);
        return suggestions;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch suggestions');
    }
};

exports.getAddressFromCoordinates = async (lat, lng) => {
    const cacheKey = getCacheKey('reverse-geocode', `${lat},${lng}`);
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    try {
        const { data } = await nominatimClient.get('/reverse', {
            params: { lat, lon: lng, format: 'json', zoom: 18 }
        });

        const result = {
            address: data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            lat: Number(lat),
            lng: Number(lng)
        };
        setCache(cacheKey, result);
        return result;
    } catch (error) {
        // Coordinates remain usable even when the public reverse-geocoder is unavailable.
        return { address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat: Number(lat), lng: Number(lng) };
    }
};

exports.getDistanceAndDuration = async (originCoords, destCoords) => {
    const cacheKey = getCacheKey(
        'route',
        `${originCoords.lat},${originCoords.lng}|${destCoords.lat},${destCoords.lng}`
    );
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    try {
        const coords = `${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}`;
        const { data } = await osrmClient.get(`/route/v1/driving/${coords}`, {
            params: {
                overview: 'full',
                geometries: 'geojson',
                alternatives: false
            }
        });

        if (!data.routes || data.routes.length === 0) {
            throw new Error('No route found between the given locations');
        }

        const route = data.routes[0];
        const result = {
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry
        };

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to calculate route');
    }
};
