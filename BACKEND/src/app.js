const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/api/auth', authRoutes);

module.exports= app;