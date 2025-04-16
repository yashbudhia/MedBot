// models/Patient.js
const mongoose = require('mongoose');

// Define the schema for a family member
const FamilyMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relation: { type: String, required: true },
    conditions: [{ type: String }] // Array of medical conditions
}, { timestamps: true });

// Define the schema for a patient
const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Medications (assuming you already have something similar)
    medications: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            schedule: { type: String, required: true },
            status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
        },
    ],

    // Family History as an array of FamilyMemberSchema
    familyHistory: [FamilyMemberSchema],
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
