let io = null;

exports.setIo = (instance) => {
    io = instance;
};

exports.getIo = () => io;

/**
 * Emit an event to a specific connected client by socket id.
 * socketId is stored on User/Captain models and updated on connect/disconnect.
 */
exports.sendMessageToSocketId = (socketId, event, data) => {
    if (!io || !socketId) return;
    io.to(socketId).emit(event, data);
};

exports.emitToUser = async (userId, event, data) => {
    const userModel = require('../models/user.model');
    const user = await userModel.findById(userId);
    if (user?.socketId) {
        exports.sendMessageToSocketId(user.socketId, event, data);
    }
};

exports.emitToCaptain = async (captainId, event, data) => {
    const captainModel = require('../models/captain.model');
    const captain = await captainModel.findById(captainId);
    if (captain?.socketId) {
        exports.sendMessageToSocketId(captain.socketId, event, data);
    }
};
