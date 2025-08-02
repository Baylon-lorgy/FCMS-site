const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { verifyToken } = require('../middleware/auth');

// Enhanced logging and error handling for debugging

// Get all schedules for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('Unauthorized access: Missing user ID');
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    console.log('Fetching schedules for userId:', req.user.id); // Debug log
    const schedules = await Schedule.find({ userId: req.user.id })
      .sort({ day: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
});

// Get schedules by faculty ID (for students to view)
router.get('/faculty/:facultyId', async (req, res) => {
  try {
    console.log('Fetching schedules for facultyId:', req.params.facultyId); // Debug log
    const schedules = await Schedule.find({ 
      userId: req.params.facultyId 
    }).sort({ day: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching faculty schedules:', error);
    res.status(500).json({ message: 'Error fetching faculty schedules', error: error.message });
  }
});

// Add a new schedule
router.post('/', verifyToken, async (req, res) => {
  try {
    const { day, startTime, endTime, location } = req.body;

    // Validate required fields
    if (!day || !startTime || !endTime || !location) {
      console.error('Validation error: Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for schedule conflicts
    const existingSchedule = await Schedule.findOne({
      userId: req.user.id,
      day,
      $or: [
        {
          startTime: { $lte: endTime },
          endTime: { $gte: startTime }
        }
      ]
    });

    if (existingSchedule) {
      console.error('Schedule conflict detected for userId:', req.user.id);
      return res.status(400).json({ message: 'Schedule conflict detected' });
    }

    const schedule = new Schedule({
      userId: req.user.id,
      day,
      startTime,
      endTime,
      location
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
});

// Update a schedule
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { day, startTime, endTime, location } = req.body;
    const scheduleId = req.params.id;

    // Check if schedule exists and belongs to user
    const existingSchedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.user.id
    });

    if (!existingSchedule) {
      console.error('Schedule not found for userId:', req.user.id);
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check for conflicts with other schedules
    const conflictingSchedule = await Schedule.findOne({
      userId: req.user.id,
      day,
      _id: { $ne: scheduleId },
      $or: [
        {
          startTime: { $lte: endTime },
          endTime: { $gte: startTime }
        }
      ]
    });

    if (conflictingSchedule) {
      console.error('Schedule conflict detected for userId:', req.user.id);
      return res.status(400).json({ message: 'Schedule conflict detected' });
    }

    // Update schedule
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { day, startTime, endTime, location },
      { new: true }
    );

    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
});

// Delete a schedule
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!schedule) {
      console.error('Schedule not found for deletion, userId:', req.user.id);
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Error deleting schedule', error: error.message });
  }
});

module.exports = router;
