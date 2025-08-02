const mongoose = require('mongoose');
const User = require('../models/User');
const Subject = require('../models/Subject');
require('dotenv').config();

const createTestSubjects = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty-consultation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Find the faculty user
        const faculty = await User.findOne({ role: 'faculty' });
        if (!faculty) {
            console.log('No faculty user found. Please run createTestFaculty.js first.');
            return;
        }

        console.log('Found faculty:', faculty.name);

        // Create test subjects
        const subjects = [
            {
                subjectCode: 'CS101',
                subjectName: 'Introduction to Programming',
                facultyId: faculty._id,
                room: 'Room 101',
                schedule: {
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '10:30'
                },
                isActive: true
            },
            {
                subjectCode: 'CS102',
                subjectName: 'Data Structures',
                facultyId: faculty._id,
                room: 'Room 102',
                schedule: {
                    day: 'Wednesday',
                    startTime: '13:00',
                    endTime: '14:30'
                },
                isActive: true
            }
        ];

        // Save subjects
        for (const subjectData of subjects) {
            const subject = new Subject(subjectData);
            await subject.save();
            console.log('Created subject:', subject.subjectName);
        }

        console.log('Test subjects created successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createTestSubjects(); 