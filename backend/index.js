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