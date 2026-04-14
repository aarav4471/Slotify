const express = require('express');
const { saveAvailability, getAvailability, getAvailableSlots } = require('../controllers/availability');
const router = express.Router();

router.post('/', saveAvailability);
router.get('/', getAvailability);
router.get('/slots/:eventSlug', getAvailableSlots);

module.exports = router;
