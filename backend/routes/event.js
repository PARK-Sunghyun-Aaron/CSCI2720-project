/*
I/We declare that the lab work here submitted is original except for source material explicitly acknowledged,
and that the same or closely related material has not been previously submitted for another course. 
I/We also acknowledge that I/We am aware of University policy and regulations on honesty in academic work, 
and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, 
as contained in the website. University Guideline on Academic Honesty: https://www.cuhk.edu.hk/policy/academichonesty/ 
Student Name : LIN Yi Student ID : 1155232784 Student Name : MANAV Suryansh Student ID : 1155156662 
Student Name : MUI Ka Shun Student ID : 1155194765 Student Name : PARK Sunghyun Student ID : 1155167933 
Student Name : RAO Penghao Student ID : 1155191490 Class/Section : CSCI2720 Date : 2024-12-04
*/

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

// Update a event
router.put('/updateEvent/:id', async (req, res) => {
    const filter = { eventid: req.params.id};
    const update = {
        title: req.body.title,
        venue: req.body.venue,
        date: req.body.date,
        duration: req.body.duration,
        descre: req.body.descre,
        pre: req.body.pre,
    }
    try {

        const updatedEvent = await Event.findOneAndUpdate(
            filter, update,
            { new: true }
        );
        
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        console.log('Updated event:', updatedEvent);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
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
