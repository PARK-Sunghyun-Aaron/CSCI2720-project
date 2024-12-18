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
