const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// List all events
router.get('/listAllEvents', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single event
router.get('/loadEvent/:id', async (req, res) => {
    try {
        const event = await Event.findOne({ eventid: req.params.id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;