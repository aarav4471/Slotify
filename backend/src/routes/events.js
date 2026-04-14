const express = require('express');
const { createEvent, getEvents, getEventBySlug } = require('../controllers/events');
const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:slug', getEventBySlug);

module.exports = router;
