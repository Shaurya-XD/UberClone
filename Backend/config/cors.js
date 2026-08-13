const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const requestOrigin = (req) => {
    const host = req.headers.host;
    if (!host) return null;
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = forwardedProto
        ? forwardedProto.split(',')[0].trim()
        : req.socket.encrypted ? 'https' : 'http';
    return `${protocol}://${host}`;
};

const isAllowedOrigin = (origin, req) => {
    if (!origin) return true;
    return allowedOrigins.includes(origin) || origin === requestOrigin(req);
};

const corsOptionsFor = (req) => ({
    origin(origin, callback) {
        // Return false instead of throwing: browsers receive no CORS grant for
        // untrusted cross-origin requests, while valid same-origin requests work.
        callback(null, isAllowedOrigin(origin, req));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
});

module.exports = { allowedOrigins, corsOptionsFor, isAllowedOrigin };
