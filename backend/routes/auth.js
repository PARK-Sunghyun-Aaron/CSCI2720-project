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
const bcrypt = require('bcrypt');
const User = require('../models/User'); // You'll need to create this model
const router = express.Router();
const jwt = require('jsonwebtoken');

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
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
            message: 'Login successful', 
            user: { 
                email: user.email, 
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                locations: [],
            },
            token: token 
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
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
