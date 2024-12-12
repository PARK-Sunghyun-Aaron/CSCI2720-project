const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // You'll need to create this model
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password, isUser } = req.body;
    const role = isUser ? 'user' : 'admin';

    try {
        // Find user by email and role
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Successful login - you might want to generate a token here
        res.json({ 
            message: 'Login successful', 
            user: { 
                email: user.email, 
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            } 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName, isUser } = req.body;
    const role = isUser ? 'user' : 'admin';

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role
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
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;