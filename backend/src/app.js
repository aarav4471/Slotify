const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const availabilityRoutes = require('./routes/availability');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Global error handler
app.use(errorHandler);

module.exports = app;
