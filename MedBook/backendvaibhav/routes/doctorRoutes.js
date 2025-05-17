// routes/doctorRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // Add validation
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

// Sign Up (Doctor)
router.post(
    '/signup',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('licenseNumber').notEmpty().withMessage('License Number is required'),
        body('userId').notEmpty().withMessage('User ID is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Send validation errors to the client
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, licenseNumber, userId, password } = req.body;

            // Check if userId or email already exists
            const existing = await Doctor.findOne({ $or: [{ userId }, { email }] });
            if (existing) {
                return res.status(400).json({ error: 'User ID or Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new doctor
            const newDoctor = new Doctor({
                name,
                email,
                licenseNumber,
                userId,
                password: hashedPassword,
            });

            await newDoctor.save();

            // Generate JWT token
            const secret = process.env.JWT_SECRET || 'default_secret'; // Use environment variable in production
            if (!secret) {
                console.error('JWT_SECRET is not defined in environment variables');
                return res.status(500).json({ error: 'Server configuration error' });
            }

            const token = jwt.sign({ id: newDoctor._id, userType: 'doctor' }, secret, { expiresIn: '1h' });

            res.status(201).json({
                message: 'Doctor registered successfully',
                token,
                userId: newDoctor.userId,
                name: newDoctor.name,
            });
        } catch (err) {
            console.error('Doctor Signup Error:', err);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
);

// Sign In (Doctor)
router.post(
    '/signin',
    [
        body('userId').notEmpty().withMessage('User ID is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Send validation errors to the client
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId, password } = req.body;

            // Find doctor by userId
            const doctor = await Doctor.findOne({ userId });
            if (!doctor) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const secret = process.env.JWT_SECRET || 'default_secret'; // Use environment variable in production
            if (!secret) {
                console.error('JWT_SECRET is not defined in environment variables');
                return res.status(500).json({ error: 'Server configuration error' });
            }

            const token = jwt.sign({ id: doctor._id, userType: 'doctor' }, secret, { expiresIn: '1h' });

            res.status(200).json({
                token,
                userId: doctor.userId,
                name: doctor.name,
            });
        } catch (err) {
            console.error('Doctor Signin Error:', err);
            res.status(500).json({ error: 'Sign in failed' });
        }
    }
);

// Get Doctor Profile
router.get('/profile', auth, async (req, res) => { // Apply auth middleware
    try {
        const doctor = req.user; // 'auth' middleware attaches the user to req
        res.status(200).json({
            name: doctor.name,
            email: doctor.email,
            userId: doctor.userId,
            licenseNumber: doctor.licenseNumber,
        });
    } catch (err) {
        console.error('Get Profile Error:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

module.exports = router;
