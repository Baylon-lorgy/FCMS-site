const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const { verifyToken } = require('../middleware/auth');

// Get all faculty members with their subjects
router.get('/faculty-with-subjects', verifyToken, async (req, res) => {
    try {
        // Find all users with role 'faculty' and isEmailVerified: true
        const faculty = await User.find({ 
            role: 'faculty',
            isEmailVerified: true
        })
        .select('name email school_id department contact_number')
        .lean();

        console.log('Found faculty:', faculty.length);

        // Get subjects for each faculty member and combine the data
        const facultyWithSubjects = await Promise.all(faculty.map(async (f) => {
            const subjects = await Subject.find({ 
                facultyId: f._id,
                isActive: true
            })
            .select('subjectName subjectCode schedule room')
            .populate('schedule')
            .lean();
            
            return {
                ...f,
                subjects: subjects.map(s => ({
                    _id: s._id,
                    subjectCode: s.subjectCode,
                    subjectName: s.subjectName,
                    schedule: s.schedule,
                    room: s.room
                })) || []
            };
        }));

        console.log('Sending faculty data:', facultyWithSubjects.length, 'faculty members found');
        res.json(facultyWithSubjects);
    } catch (error) {
        console.error('Error fetching faculty data:', error);
        res.status(500).json({ 
            message: 'Error fetching faculty data',
            error: error.message 
        });
    }
});

module.exports = router;
