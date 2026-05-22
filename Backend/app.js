const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDB } = require('./db/db');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(cookieParser());

app.use('/users', userRoutes);

module.exports = app;
