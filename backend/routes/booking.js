const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Create a new booking
router.post('/create', async (req, res) => {
    try {
        const { eventId, userEmail } = req.body;
        
        // Check if booking already exists
        const existingBooking = await Booking.findOne({
            eventId,
            userEmail,
            status: 'active'
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        const newBooking = new Booking({
            eventId,
            userEmail
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's bookings with event details
router.get('/user/:userEmail', async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            userEmail: req.params.userEmail,
            status: 'active'
        });

        // Get event details for each booking
        const bookingsWithDetails = await Promise.all(
            bookings.map(async (booking) => {
                const event = await Event.findOne({ eventid: booking.eventId });
                return {
                    ...booking.toObject(),
                    event
                };
            })
        );

        res.json(bookingsWithDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel a booking
router.put('/cancel/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 