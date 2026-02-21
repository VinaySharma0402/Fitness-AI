require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/measurements', require('./routes/measurements'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FitAI server running on port ${PORT}`));
