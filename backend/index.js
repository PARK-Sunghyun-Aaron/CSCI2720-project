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
const mongoose = require('mongoose');
const cors = require('cors');
const { fetchDataInOrder } = require('./services/dataFetcher');
const Event = require('./models/Event');
const Location = require('./models/Location');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');

        // delete every data collection
        let db = mongoose.connection;
        db.collection('events').deleteMany({});
        db.collection('locations').deleteMany({});
        db.collection('bookings').deleteMany({});
        db.collection('users').deleteMany({});

        // Fetch and save data when the server starts
        fetchDataInOrder();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const bookingRoutes = require('./routes/booking');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const locationRoutes = require('./routes/location');
const authRoutes = require('./routes/auth');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Add the simple routes from the snippet
app.get('/location', (req, res) => {
    Location.find({})
        .then((data) => {
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});

app.get('/event', (req, res) => {
    Event.find({})
        .then((data) => {
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
