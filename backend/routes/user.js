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
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create a new user
router.post('/createUser', async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            locations: []
        });
        await newUser.save();

        res.status(201).json({ 
            message: 'Signup successful',
            user: { 
                email: newUser.email, 
                role: newUser.role,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            } 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// List all users
router.get('/readAllUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Load a user by email
router.get('/loadUser/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Loaded user:', user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// Update a user
router.put('/updateUser/:email/:originalEmail', async (req, res) => {
    const filter = { email: req.params.originalEmail};
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const update = {
        email: req.params.email,
        passowrd: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }
    try {

        const updatedUser = await User.findOneAndUpdate(
            filter, update,
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('Updated user:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete a user
router.post('/deleteUser/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Add favorite location
router.post('/favorites/:email', async (req, res) => {
    const { email } = req.params;
    const { locationId } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.locations.includes(locationId)) {
            user.locations.push(locationId);
            await user.save();
        }
        
        res.json(user.locations);
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite', error });
    }
});

// Remove favorite location
router.delete('/favorites/:email/:locationId', async (req, res) => {
    const { email, locationId } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.locations = user.locations.filter(id => id !== locationId);
        await user.save();
        
        res.json(user.locations);
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error });
    }
});

// Get user's favorite locations
router.get('/favorites/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});

module.exports = router;
