const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateFacultyStatus = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty-consultation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // First, find all faculty users
        const faculty = await User.find({ role: 'faculty' });
        console.log('Found', faculty.length, 'faculty users');

        // Update each faculty user individually
        for (const f of faculty) {
            console.log('\nUpdating faculty:', f.email);
            const result = await User.findByIdAndUpdate(
                f._id,
                { $set: { isActive: true } },
                { new: true }
            );
            console.log('Updated:', result.email, 'isActive:', result.isActive);
        }

        // Verify all updates
        const updatedFaculty = await User.find({ role: 'faculty' });
        console.log('\nFinal Status:');
        updatedFaculty.forEach(f => {
            console.log('\nFaculty Details:');
            console.log('Name:', f.name);
            console.log('Email:', f.email);
            console.log('Is Active:', f.isActive);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

updateFacultyStatus(); 