const express = require('express');
const { createBooking, getBookings, cancelBooking } = require('../controllers/bookings');
const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.post('/:id/cancel', cancelBooking);

module.exports = router;
