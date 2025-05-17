const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Use bcrypt for hashing
    token: { type: String },
});

module.exports = mongoose.model('Doctor', doctorSchema);
