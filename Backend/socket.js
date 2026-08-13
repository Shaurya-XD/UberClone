const jwt = require('jsonwebtoken');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const blacklistModel = require('./models/blacklistToken.model');
const { setIo, sendMessageToSocketId } = require('./utils/socket.util');
const { allowedOrigins, isAllowedOrigin } = require('./config/cors');

const initSocket = (server) => {
    const { Server } = require('socket.io');

    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        },
        // Socket.IO's CORS option has no request context. Validate the request
        // here so ECS same-origin traffic is accepted without an IP allowlist.
        allowRequest: (req, callback) => callback(null, isAllowedOrigin(req.headers.origin, req))
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            const role = socket.handshake.auth?.role;

            if (!token || !role) {
                return next(new Error('Authentication required'));
            }

            const blacklisted = await blacklistModel.findOne({ token });
            if (blacklisted) {
                return next(new Error('Token has been blacklisted'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (role === 'user') {
                const user = await userModel.findById(decoded._id);
                if (!user) return next(new Error('Unauthorized user'));
                socket.user = user;
                socket.role = 'user';
            } else if (role === 'captain') {
                const captain = await captainModel.findById(decoded._id);
                if (!captain) return next(new Error('Unauthorized captain'));
                socket.captain = captain;
                socket.role = 'captain';
            } else {
                return next(new Error('Invalid role'));
            }

            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`Socket connected: ${socket.id} (${socket.role})`);
        // Persist socketId on the model so targeted emits survive reconnects
        if (socket.role === 'user') {
            await userModel.findByIdAndUpdate(socket.user._id, { socketId: socket.id });
        } else if (socket.role === 'captain') {
            await captainModel.findByIdAndUpdate(socket.captain._id, { socketId: socket.id });
        }

        socket.on('update-location', async ({ lat, lng, rideId }) => {
            if (socket.role !== 'captain') return;

            await captainModel.findByIdAndUpdate(socket.captain._id, {
                'vehicle.location.lat': lat,
                'vehicle.location.lng': lng
            });

            if (rideId) {
                const rideModel = require('./models/ride.model');
                const ride = await rideModel.findById(rideId).populate('user');
                if (ride?.user?.socketId) {
                    sendMessageToSocketId(ride.user.socketId, 'captain-location-update', {
                        captainId: socket.captain._id,
                        location: { lat, lng }
                    });
                }
            }
        });

        socket.on('disconnect', async () => {
            if (socket.role === 'user') {
                // Do not erase a newer connection created during a reconnect
                // (React StrictMode can briefly create overlapping sockets).
                await userModel.findOneAndUpdate(
                    { _id: socket.user._id, socketId: socket.id },
                    { socketId: null }
                );
            } else if (socket.role === 'captain') {
                await captainModel.findOneAndUpdate(
                    { _id: socket.captain._id, socketId: socket.id },
                    { socketId: null }
                );
            }
        });
    });

    setIo(io);
    return io;
};

module.exports = { initSocket };
