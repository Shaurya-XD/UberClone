const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./app');
const { initSocket } = require('./socket');
const { connectToDB } = require('./db/db');

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 4000;

const start = async () => {
    await connectToDB();
    server.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));
};

const shutdown = (signal) => {
    console.log(`${signal} received; shutting down`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
