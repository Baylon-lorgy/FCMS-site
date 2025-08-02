const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { verifyToken } = require('../middleware/auth');

// Get all subjects for the logged-in faculty
router.get('/', verifyToken, async (req, res) => {
  try {
    const subjects = await Subject.find({ facultyId: req.user.id, isActive: true })
      .sort({ subjectCode: 1 });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// Add a new subject
router.post('/', verifyToken, async (req, res) => {
  try {
    const { subjectCode, subjectName, schedule, room, subjectSchedule } = req.body;

    // Validate required fields
    if (!subjectCode || !subjectName || !schedule || !schedule.day || !schedule.startTime || !schedule.endTime || !room) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for schedule conflicts
    const existingSubject = await Subject.findOne({
      facultyId: req.user.id,
      'schedule.day': schedule.day,
      isActive: true,
      $or: [
        {
          $and: [
            { 'schedule.startTime': { $lte: schedule.startTime } },
            { 'schedule.endTime': { $gt: schedule.startTime } }
          ]
        },
        {
          $and: [
            { 'schedule.startTime': { $lt: schedule.endTime } },
            { 'schedule.endTime': { $gte: schedule.endTime } }
          ]
        }
      ]
    });

    if (existingSubject) {
      return res.status(400).json({ message: 'Schedule conflict detected' });
    }

    // Check for duplicate subject code
    const duplicateSubject = await Subject.findOne({
      facultyId: req.user.id,
      subjectCode: subjectCode,
      isActive: true
    });

    if (duplicateSubject) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    const subject = new Subject({
      facultyId: req.user.id,
      subjectCode,
      subjectName,
      schedule,
      room,
      subjectSchedule: subjectSchedule || ''
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Error creating subject', error: error.message });
  }
});

// Update a subject
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { subjectCode, subjectName, schedule, room, subjectSchedule } = req.body;
    const subjectId = req.params.id;

    // Check if subject exists and belongs to faculty
    const existingSubject = await Subject.findOne({
      _id: subjectId,
      facultyId: req.user.id,
      isActive: true
    });

    if (!existingSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check for schedule conflicts
    const conflictingSubject = await Subject.findOne({
      facultyId: req.user.id,
      'schedule.day': schedule.day,
      _id: { $ne: subjectId },
      isActive: true,
      $or: [
        {
          $and: [
            { 'schedule.startTime': { $lte: schedule.startTime } },
            { 'schedule.endTime': { $gt: schedule.startTime } }
          ]
        },
        {
          $and: [
            { 'schedule.startTime': { $lt: schedule.endTime } },
            { 'schedule.endTime': { $gte: schedule.endTime } }
          ]
        }
      ]
    });

    if (conflictingSubject) {
      return res.status(400).json({ message: 'Schedule conflict detected' });
    }

    // Check for duplicate subject code
    const duplicateSubject = await Subject.findOne({
      facultyId: req.user.id,
      subjectCode: subjectCode,
      _id: { $ne: subjectId },
      isActive: true
    });

    if (duplicateSubject) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    existingSubject.subjectCode = subjectCode;
    existingSubject.subjectName = subjectName;
    existingSubject.schedule = schedule;
    existingSubject.room = room;
    if (typeof subjectSchedule !== 'undefined') {
      existingSubject.subjectSchedule = subjectSchedule;
    }

    await existingSubject.save();
    res.json(existingSubject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ message: 'Error updating subject', error: error.message });
  }
});

// Delete a subject (soft delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      facultyId: req.user.id,
      isActive: true
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.isActive = false;
    await subject.save();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
});

// Get subjects by faculty ID (for students to view)
router.get('/faculty/:facultyId', async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      facultyId: req.params.facultyId,
      isActive: true 
    }).sort({ subjectCode: 1 });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching faculty subjects:', error);
    res.status(500).json({ message: 'Error fetching faculty subjects', error: error.message });
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
      $or: [
        { subjectCode: { $regex: query, $options: 'i' } },
        { subjectName: { $regex: query, $options: 'i' } },
        { room: { $regex: query, $options: 'i' } }
      ]
    }).sort({ subjectCode: 1 });

    res.json(subjects);
  } catch (error) {
    console.error('Error searching subjects:', error);
    res.status(500).json({ message: 'Error searching subjects', error: error.message });
  }
});

module.exports = router;
