const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const { corsOptionsFor } = require('./config/cors');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const captainRoutes = require('./routes/captain.routes');
const rideRoutes = require('./routes/ride.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Trust the ALB's forwarded protocol so same-origin HTTPS works in ECS.
app.set('trust proxy', 1);
app.use((req, res, next) => cors(corsOptionsFor(req))(req, res, next));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/rides', rideRoutes);

app.get('/health', (req, res) => {
    const healthy = mongoose.connection.readyState === 1;
    res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'unavailable' });
});

const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(publicDir, 'assets');

// Hashed Vite assets must never fall through to the SPA document. A script
// requested as HTML leaves React with a blank page and a MIME-type error.
app.use('/assets', express.static(assetsDir, {
    fallthrough: false,
    immutable: true,
    maxAge: '1y'
}));
app.use(express.static(publicDir, { index: false }));
app.use((req, res, next) => {
    if (req.method === 'GET' && !path.extname(req.path) && req.accepts('html')) {
        return res.sendFile(path.join(publicDir, 'index.html'));
    }
    next();
});

module.exports = app;
