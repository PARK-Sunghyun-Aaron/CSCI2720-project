const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create a new event
router.post('/createEvent', async (req, res) => {
    const { eventid, title, venue, date, duration, descre, pre } = req.body;
    try {
        const existingEvent = await Event.findOne({ eventid });
        if (existingEvent) {
            return res.status(400).json({ message: 'Event already exists' });
        }

        const newEvent = new Event({
            eventid,
            title,
            venue,
            date,
            duration,
            descre,
            pre,
        });
        await newEvent.save();

        res.status(201).json({ 
            message: 'Event created successfully',
            event: { 
                eventid: newEvent.eventid, 
                title: newEvent.title,
                venue: newEvent.venue,
                date: newEvent.date,
                duration: newEvent.duration,
                descre: newEvent.descre,
                pre: newEvent.pre,
            } 
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// List all events
router.get('/listAllEvents', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Load a event by eventid
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

// Delete event
router.delete('/deleteEvent/:eventid', async (req,res) => {
    const { eventid } = req.params;
        try {
            const deletedEvent = await Event.findOneAndDelete({ eventid });
            if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting event', error });
        }
});

module.exports = router;