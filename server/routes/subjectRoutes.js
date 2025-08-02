const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const User = require('../models/User'); // Added User model
const { verifyToken } = require('../middleware/auth');

// Debug middleware for this route
router.use((req, res, next) => {
  console.log('Subject Route:', req.method, req.path);
  console.log('User:', req.user);
  next();
});

// Debug route to add a test subject
router.post('/debug-add', async (req, res) => {
  try {
    const subject = new Subject({
      facultyId: req.body.facultyId,
      subjectCode: req.body.subjectCode,
      subjectName: req.body.subjectName,
      schedule: req.body.schedule,
      room: req.body.room,
      isActive: true
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Error creating subject', error: error.message });
  }
});

// Get all subjects for the logged-in faculty
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Fetching subjects for faculty:', req.user.id);
    const subjects = await Subject.find({ 
      facultyId: req.user.id,
      isActive: true 
    }).sort({ subjectCode: 1 });
    
    console.log(`Found ${subjects.length} subjects`);
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// Create a new subject
router.post('/', verifyToken, async (req, res) => {
  try {
    const { subjectCode, subjectName, schedule, room } = req.body;
    
    // Validate required fields
    if (!subjectCode || !subjectName || !schedule || !room) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['subjectCode', 'subjectName', 'schedule', 'room']
      });
    }

    const subject = new Subject({
      facultyId: req.user.id,
      subjectCode,
      subjectName,
      schedule,
      room,
      isActive: true
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Error creating subject', error: error.message });
    }
  }
});

// Update a subject
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { subjectCode, subjectName, schedule, room } = req.body;
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user.id },
      { subjectCode, subjectName, schedule, room },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Error updating subject', error: error.message });
    }
  }
});

// Delete a subject (soft delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
});

// Search subjects
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const subjects = await Subject.find({
      facultyId: req.user.id,
      isActive: true,
      $text: { $search: query }
    });

    res.json(subjects);
  } catch (error) {
    console.error('Error searching subjects:', error);
    res.status(500).json({ message: 'Error searching subjects', error: error.message });
  }
});

// Get subject by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      facultyId: req.user.id,
      isActive: true
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ message: 'Error fetching subject', error: error.message });
  }
});

// Get subjects for a specific faculty
router.get('/faculty/:facultyId', verifyToken, async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    // Get all subjects assigned to this faculty
    const subjects = await Subject.find({
      facultyId: facultyId,
      isActive: true
    }).select('subjectCode subjectName _id').sort({ subjectCode: 1 });

    if (!subjects || subjects.length === 0) {
      // If no subjects found in Subject collection, try getting from User model
      const faculty = await User.findById(facultyId);
      if (faculty && faculty.topics_or_subjects && faculty.topics_or_subjects.length > 0) {
        // Convert topics_or_subjects array to proper format
        const formattedSubjects = faculty.topics_or_subjects.map((subject, index) => ({
          _id: `topic_${index}`,
          subjectCode: `SUB${index + 1}`,
          subjectName: subject
        }));
        return res.json(formattedSubjects);
      }
    }

    res.json(subjects);
  } catch (error) {
    console.error('Error fetching faculty subjects:', error);
    res.status(500).json({ message: 'Error fetching faculty subjects', error: error.message });
  }
});

module.exports = router;
