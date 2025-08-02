const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createTestFaculty = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty-consultation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Create test faculty user
        const hashedPassword = await bcrypt.hash('test123', 10);
        const faculty = new User({
            name: 'Test Faculty',
            email: 'faculty@test.com',
            school_id: 'FAC-001',
            password: hashedPassword,
            role: 'faculty',
            department: 'Computer Science',
            contact_number: '1234567890',
            isActive: true,
            account_agreement: true
        });

        await faculty.save();
        console.log('Test faculty user created successfully:', faculty);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createTestFaculty(); 