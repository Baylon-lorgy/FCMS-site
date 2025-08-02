const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const mongoose = require('mongoose');
const Consultation = require('../models/Consultation');

// Debug middleware
router.use((req, res, next) => {
  console.log(`Schedule Route: ${req.method} ${req.originalUrl}`);
  console.log('Request params:', req.params);
  console.log('Request query:', req.query);
  console.log('Request body:', req.body);
  next();
});

// Apply authentication middleware
router.use(verifyToken);

// Get all schedules (for debugging)
router.get('/debug', async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('facultyId', 'name email')
      .sort({ day: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get schedules for current user
router.get('/', async (req, res) => {
  try {
    console.log('Request user:', req.user); // Debug log
    console.log('Query params:', req.query); // Debug log
    
    const { facultyId, subjectId } = req.query;
    const query = {};

    if (facultyId) {
      if (!mongoose.Types.ObjectId.isValid(facultyId)) {
        return res.status(400).json({ message: 'Invalid faculty ID' });
      }
      query.facultyId = facultyId;
    } else {
      query.facultyId = req.user.id; // Use logged-in user's ID if no facultyId provided
    }

    if (subjectId) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      query.subjectId = subjectId;
    }

    console.log('Final query:', query);
    const schedules = await Schedule.find(query)
      .sort({ day: 1, startTime: 1 });
    
    // Get current bookings for each schedule
    const schedulesWithBookings = await Promise.all(schedules.map(async (schedule) => {
      const bookings = await Consultation.countDocuments({
        scheduleId: schedule._id,
        status: { $in: ['pending', 'approved'] }
      });
      
      return {
        ...schedule.toObject(),
        currentSlots: bookings,
        isFullyBooked: bookings >= schedule.maxSlots
      };
    }));

    console.log('Found schedules:', schedulesWithBookings.length);
    res.json(schedulesWithBookings);
  } catch (error) {
    console.error('Error fetching faculty schedules:', error);
    res.status(500).json({ message: 'Error fetching faculty schedules', error: error.message });
  }
});

// Get schedules for a specific faculty
router.get('/faculty/:facultyId', async (req, res) => {
  try {
    const { facultyId } = req.params;
    console.log('Fetching schedules for faculty:', facultyId);
    
    if (!facultyId || !mongoose.Types.ObjectId.isValid(facultyId)) {
      console.log('Invalid faculty ID:', facultyId);
      return res.status(400).json({ message: 'Invalid faculty ID' });
    }

    const schedules = await Schedule.find({ facultyId: facultyId })
      .sort({ day: 1, startTime: 1 });
    
    console.log('Found schedules:', schedules);
    
    if (!schedules) {
      return res.status(200).json([]);
    }
    
    return res.json(schedules);
  } catch (error) {
    console.error('Error fetching faculty schedules:', error);
    return res.status(500).json({ 
      message: 'Error fetching faculty schedules',
      error: error.message 
    });
  }
});

// Create a new schedule
router.post('/', async (req, res) => {
  try {
    const { day, startTime, endTime, location, maxSlots, subjectId } = req.body;
    const facultyId = req.user.id; // Use id consistently

    if (!facultyId) {
      console.error('No faculty ID found in request user:', req.user);
      return res.status(400).json({ message: 'Faculty ID is required' });
    }

    if (!subjectId || !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Valid subject ID is required' });
    }

    const schedule = new Schedule({
      facultyId,
      subjectId,
      day,
      startTime,
      endTime,
      location,
      maxSlots: parseInt(maxSlots) || 2
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
});

// Update a schedule
router.put('/:id', async (req, res) => {
  try {
    const { day, startTime, endTime, location, maxSlots, subjectId } = req.body;
    
    if (subjectId && !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const updateData = {
      day,
      startTime,
      endTime,
      location,
      maxSlots: parseInt(maxSlots) || 2
    };

    if (subjectId) {
      updateData.subjectId = subjectId;
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
});

// Delete a schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      facultyId: req.user.id // Use id consistently
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get schedule details with slot information
router.get('/:scheduleId/slots', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user._id; // Get current user ID

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Get all consultations for this schedule
    const consultations = await Consultation.find({
      scheduleId,
      status: { $in: ['pending', 'approved'] }
    }).populate('studentId', 'name');

    // Check if current user has booked this schedule
    const userBooking = consultations.find(
      consultation => consultation.studentId._id.toString() === userId.toString()
    );

    const response = {
      maxSlots: schedule.maxSlots,
      bookedSlots: consultations.length,
      availableSlots: Math.max(0, schedule.maxSlots - consultations.length),
      isUserBooked: !!userBooking,
      userBookingStatus: userBooking ? userBooking.status : null,
      currentBookings: consultations.map(c => ({
        studentName: c.studentId.name,
        status: c.status
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting schedule slots:', error);
    res.status(500).json({ message: 'Error getting schedule slots', error: error.message });
  }
});

module.exports = router;
