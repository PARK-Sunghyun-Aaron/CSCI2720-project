const express = require('express');
const router = express.Router();
const Location = require('../models/Location');


// Create a new location
router.post('/createLocation', async (req, res) => {
    const { locName, latitude, longitude } = req.body;
    try {
        const newLocation = new Location({ locName, latitude, longitude });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating location', error });
    }
});

// List all locations
router.get('/listAllLocations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

// Load a location by name
router.get('/loadLocation/:locName', async (req, res) => {
    const { locName } = req.params;
    try {
        const location = await Location.findOne({ $or: [{ location: locName }, { venueid: locName }] });
        console.log(location)
        if (!location) return res.status(404).json({ message: 'Location not found' });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching location', error });
    }
});

// Update a location
router.put('/updateLocation/:locName', async (req, res) => {
    const { locName } = req.params;
    const { latitude, longitude } = req.body;
    try {
        const updatedLocation = await Location.findOneAndUpdate(
            { locName },
            { latitude, longitude },
            { new: true }
        );
        if (!updatedLocation) return res.status(404).json({ message: 'Location not found' });
        res.status(200).json(updatedLocation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
});

// Delete a location
router.post('/deleteLocation/:locName', async (req, res) => {
    const { locName } = req.params;
    try {
        const deletedLocation = await Location.findOneAndDelete({ locName });
        if (!deletedLocation) return res.status(404).json({ message: 'Location not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting location', error });
    }
});

// Get comments for a location
router.get('/comments/:locName', async (req, res) => {
    const { locName } = req.params;
    try {
        const location = await Location.findOne({ location: locName });
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(location.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a comment to a location
router.post('/comments/:locName', async (req, res) => {
    const { locName } = req.params;
    try {
        const location = await Location.findOne({ location: locName });
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const newComment = {
            userId: req.body.userId,
            text: req.body.text,
            timestamp: new Date()
        };

        location.comments.push(newComment);
        await location.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Optional: Delete a comment
router.delete('/comments/:locationId/:commentId', async (req, res) => {
    try {
        const location = await Location.findOne({ venueid: req.params.locationId });
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        location.comments = location.comments.filter(
            comment => comment._id.toString() !== req.params.commentId
        );

        await location.save();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;