// middleware/auth.js
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const auth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'default_secret';

        // Verify token
        const decoded = jwt.verify(token, secret);
        // we expect decoded to have: { id: '...', userType: 'patient' or 'doctor', iat, exp }

        const { id, userType } = decoded;
        let user;

        if (userType === 'patient') {
            user = await Patient.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Patient not found' });
            }
        } else if (userType === 'doctor') {
            user = await Doctor.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid userType in token' });
        }

        // Attach user and userType to req
        req.user = user;
        req.userType = userType;

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = auth;
