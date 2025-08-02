const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const Schedule = require('../models/Schedule'); // Added Schedule model
const { verifyToken } = require('../middleware/auth');
const Subject = require('../models/Subject'); // Added Subject model
const { sendConsultationStatusEmail } = require('../utils/emailService');

// Debug routes
router.get('/debug/test', (req, res) => {
  res.json({ message: 'Debug route is working' });
});

// Debug route to list all routes in this router
router.get('/debug/routes', (req, res) => {
  const routes = [];
  router.stack.forEach(middleware => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      routes.push({
        path: middleware.route.path,
        methods: methods
      });
    }
  });
  res.json(routes);
});

// Notifications routes - moved to top to prevent being overridden
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    console.log('Fetching unread notifications for student:', req.user.id);
    const notifications = await Consultation.find({ studentId: req.user.id, isRead: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name')
      .populate('facultyId', 'name')
      .populate('subjectId', 'subjectName');

    console.log(`Found ${notifications.length} unread notifications for student ${req.user.id}`);

    const formattedNotifications = notifications.map(consultation => ({
      _id: consultation._id,
      studentName: consultation.studentId?.name || 'Unknown Student',
      subject: consultation.subjectId?.subjectName || 'Unknown Subject',
      createdAt: consultation.createdAt,
      status: consultation.status,
      isRead: consultation.isRead || false
    }));

    res.json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

router.put('/notifications/read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Consultation.updateMany(
      { studentId: userId, isRead: { $ne: true } },
      { $set: { isRead: true } }
    );
    res.json({
      message: 'Notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking notifications as read',
      error: error.message
    });
  }
});

// Get consultations for a faculty
router.get('/faculty/:facultyId', verifyToken, async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { subjectIds, page = 1, limit = 5 } = req.query;
    
    console.log('Fetching consultations with params:', {
      facultyId,
      subjectIds,
      page,
      limit,
      user: req.user
    });
    
    if (!facultyId) {
      return res.status(400).json({ message: 'Faculty ID is required' });
    }

    let query = { facultyId };
    
    // If subjectIds is provided, add it to the query
    if (subjectIds) {
      const subjectIdArray = subjectIds.split(',');
      query.subjectId = { $in: subjectIdArray };
    }
    
    console.log('MongoDB query:', query);
    
    // Get total count
    const totalCount = await Consultation.countDocuments(query);
    console.log('Total consultations found:', totalCount);
    
    // Get paginated consultations
    const consultations = await Consultation.find(query)
      .populate('studentId', 'name email')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    console.log('Paginated consultations found:', consultations.length);
    console.log('First consultation sample:', consultations[0]);

    const response = {
      consultations,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      itemsPerPage: parseInt(limit)
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ 
      message: 'Error fetching consultations', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Get consultations for a student
router.get('/student/:studentId', verifyToken, async (req, res) => {
  try {
    const consultations = await Consultation.find({ studentId: req.params.studentId })
      .populate('facultyId', 'name email')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId')
      .sort('-createdAt');
    console.log('Consultations returned to student:', consultations.map(c => ({
      id: c._id,
      status: c.status,
      subject: c.subjectId?.subjectName,
      faculty: c.facultyId?.name
    })));
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
});

// Create a new consultation
router.post('/', verifyToken, async (req, res) => {
  try {
    const { facultyId, subjectId, scheduleId, schedule } = req.body;
    const studentId = req.user.id;

    // Validate required fields
    if (!facultyId || !subjectId || !scheduleId || !schedule) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate schedule fields
    if (!schedule.day || !schedule.startTime || !schedule.endTime || !schedule.location) {
      return res.status(400).json({ message: 'Missing required schedule fields' });
    }

    // Get the subject to verify it exists and belongs to the faculty
    const subject = await Subject.findOne({ _id: subjectId, facultyId });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or does not belong to the faculty' });
    }

    // Get the student's section from their profile
    const student = await require('../models/User').findById(studentId);
    const section = student && student.section ? student.section : 'N/A';

    // Check if student already has a consultation for this schedule
    const existingConsultation = await Consultation.findOne({
      studentId,
      subjectId,
      'schedule.day': schedule.day,
      'schedule.startTime': schedule.startTime,
      'schedule.endTime': schedule.endTime,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingConsultation) {
      return res.status(400).json({ message: 'You already have a consultation booked for this schedule' });
    }

    // Get current consultations for this schedule
    const currentConsultations = await Consultation.countDocuments({
      subjectId,
      'schedule.day': schedule.day,
      'schedule.startTime': schedule.startTime,
      'schedule.endTime': schedule.endTime,
      status: { $in: ['pending', 'approved'] }
    });

    // Default max slots is 2
    const maxSlots = 2;
    if (currentConsultations >= maxSlots) {
      return res.status(400).json({ message: 'No available slots for this schedule' });
    }

    // Create the consultation
    const consultation = new Consultation({
      facultyId,
      studentId,
      subjectId,
      scheduleId,
      schedule,
      section, // <-- set from student profile
      status: 'pending',
      isRead: false,
      consultationDate: new Date()
    });

    await consultation.save();

    // Populate the saved consultation
    const populatedConsultation = await Consultation.findById(consultation._id)
      .populate('facultyId', 'name email')
      .populate('studentId', 'name email')
      .populate('subjectId', 'subjectName subjectCode');

    res.status(201).json(populatedConsultation);
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ message: 'Error creating consultation', error: error.message });
  }
});

// Get booking count for a schedule
router.get('/schedule/:scheduleId/count', verifyToken, async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    // Get the schedule to check its maxSlots
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const count = await Consultation.countDocuments({
      scheduleId,
      status: { $in: ['pending', 'approved'] }
    });

    res.json({
      count,
      maxSlots: schedule.maxSlots,
      remainingSlots: schedule.maxSlots - count,
      isFullyBooked: count >= schedule.maxSlots
    });
  } catch (error) {
    console.error('Error getting schedule booking count:', error);
    res.status(500).json({ 
      message: 'Error getting schedule booking count', 
      error: error.message 
    });
  }
});

// Check consultation details
router.get('/check/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Checking consultation:', {
      id,
      userId: req.user.id,
      userRole: req.user.role
    });

    const consultation = await Consultation.findById(id)
      .populate({
        path: 'facultyId',
        select: 'name email role school_id',
        model: 'User'
      })
      .populate({
        path: 'studentId',
        select: 'name email school_id',
        model: 'User'
      })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isAssignedFaculty = consultation.facultyId && 
      consultation.facultyId._id.toString() === req.user.id;

    const response = {
      consultation: {
        id: consultation._id,
        section: consultation.section,
        status: consultation.status,
        faculty: consultation.facultyId ? {
          id: consultation.facultyId._id,
          name: consultation.facultyId.name,
          role: consultation.facultyId.role,
          school_id: consultation.facultyId.school_id
        } : null,
        student: consultation.studentId ? {
          id: consultation.studentId._id,
          name: consultation.studentId.name,
          school_id: consultation.studentId.school_id
        } : null,
        subject: consultation.subjectId ? {
          id: consultation.subjectId._id,
          name: consultation.subjectId.subjectName,
          code: consultation.subjectId.subjectCode
        } : null
      },
      authorization: {
        isAdmin,
        isAssignedFaculty,
        userRole: req.user.role,
        userId: req.user.id,
        canUpdate: isAdmin || isAssignedFaculty
      }
    };

    console.log('Consultation check result:', response);
    res.json(response);
  } catch (error) {
    console.error('Error checking consultation:', error);
    res.status(500).json({ 
      message: 'Error checking consultation', 
      error: error.message
    });
  }
});

// Update consultation status with improved authorization
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('--- STATUS UPDATE REQUEST ---');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);

    // Find consultation before update
    const consultationBefore = await Consultation.findById(id)
      .populate('studentId', 'name email');
    console.log('Consultation BEFORE update:', consultationBefore);
    if (consultationBefore && consultationBefore.studentId && consultationBefore.studentId.name && consultationBefore.studentId.name.toLowerCase().includes('gusion')) {
      console.log('>>> [DEBUG] This is a Gusion consultation!');
    }

    // Existing logic
    if (!id) {
      return res.status(400).json({ message: 'Consultation ID is required' });
    }
    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const consultation = await Consultation.findById(id)
      .populate({ path: 'facultyId', select: 'name email role school_id', model: 'User' })
      .populate({ path: 'studentId', select: 'name email school_id', model: 'User' })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId');
    if (!consultation) {
      console.log('Consultation not found:', id);
      return res.status(404).json({ message: 'Consultation not found' });
    }
    // Authorization check (existing code)
    const isAdmin = req.user.role === 'admin';
    const isAssignedFaculty = consultation.facultyId && consultation.facultyId._id.toString() === req.user.id;
    if (!isAdmin && !isAssignedFaculty) {
      return res.status(403).json({ message: 'Not authorized to update this consultation' });
    }
    // Prepare update object
    const updateFields = { status };
    if (status === 'approved') {
      updateFields.approvedAt = new Date();
    }
    if (status === 'completed') {
      updateFields.completedAt = new Date();
    }

    // Update the status and timestamps
    const updated = await Consultation.findByIdAndUpdate(id, updateFields, { new: true });
    console.log('Result of findByIdAndUpdate:', updated);
    if (updated && updated.studentId && updated.studentId.name && updated.studentId.name.toLowerCase().includes('gusion')) {
      console.log('>>> [DEBUG] Gusion consultation status after update:', updated.status);
    }
    // Log after save
    const consultationAfter = await Consultation.findById(id);
    console.log('Consultation AFTER update:', consultationAfter);

    // Get the updated consultation with all populated fields
    const updatedConsultation = await Consultation.findById(id)
      .populate({
        path: 'facultyId',
        select: 'name email role school_id',
        model: 'User'
      })
      .populate({
        path: 'studentId',
        select: 'name email school_id',
        model: 'User'
      })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId');
    
    console.log('Successfully updated consultation:', {
      id: updatedConsultation._id,
      status: updatedConsultation.status,
      faculty: updatedConsultation.facultyId ? {
        id: updatedConsultation.facultyId._id,
        name: updatedConsultation.facultyId.name,
        role: updatedConsultation.facultyId.role
      } : null,
      student: updatedConsultation.studentId ? {
        id: updatedConsultation.studentId._id,
        name: updatedConsultation.studentId.name
      } : null
    });
    
    res.json(updatedConsultation);

    // After updating the status, send email if approved or rejected
    if (['approved', 'rejected'].includes(status)) {
      try {
        const studentEmail = updatedConsultation.studentId?.email;
        const studentName = updatedConsultation.studentId?.name;
        const facultyName = updatedConsultation.facultyId?.name;
        const subjectName = updatedConsultation.subjectId?.subjectName || 'your subject';
        if (studentEmail && studentName && facultyName) {
          await sendConsultationStatusEmail(studentEmail, studentName, facultyName, subjectName, status);
        }
      } catch (emailError) {
        console.error('Failed to send consultation status email:', emailError);
      }
    }
  } catch (error) {
    console.error('Error updating consultation status:', {
      error: error.message,
      stack: error.stack,
      params: req.params,
      body: req.body
    });
    res.status(500).json({ 
      message: 'Error updating consultation status', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Get all consultations
router.get('/', async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate('facultyId', 'name email')
      .populate('studentId', 'name email program year_level section')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId');
    res.status(200).json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ message: 'Failed to fetch consultations' });
  }
});

// Add a new consultation
router.post('/', async (req, res) => {
  try {
    const { facultyName, details } = req.body;
    const newConsultation = new Consultation({ facultyName, details });
    await newConsultation.save();
    res.status(201).json(newConsultation);
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ message: 'Failed to create consultation' });
  }
});

// Add routes to fetch consultations for faculty and students separately

// Get consultations for faculty
router.get('/faculty', async (req, res) => {
  try {
    const consultations = await Consultation.find({ role: 'faculty' });
    res.status(200).json(consultations);
  } catch (error) {
    console.error('Error fetching faculty consultations:', error);
    res.status(500).json({ message: 'Failed to fetch faculty consultations' });
  }
});

// Get consultations for students
router.get('/student', async (req, res) => {
  try {
    const consultations = await Consultation.find({ role: 'student' });
    res.status(200).json(consultations);
  } catch (error) {
    console.error('Error fetching student consultations:', error);
    res.status(500).json({ message: 'Failed to fetch student consultations' });
  }
});

// Add a new route to get consultations by section
router.get('/section/:section', verifyToken, async (req, res) => {
  try {
    const { section } = req.params;
    console.log('Fetching consultations for section:', section);

    const consultations = await Consultation.find({ section })
      .populate('studentId', 'name email')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId')
      .populate('facultyId', 'name email')
      .sort('-createdAt');

    console.log('Found consultations:', consultations.length);
    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations by section:', error);
    res.status(500).json({ 
      message: 'Error fetching consultations', 
      error: error.message
    });
  }
});

// Get all consultations with detailed information
router.get('/all-details', verifyToken, async (req, res) => {
  try {
    console.log('Fetching all consultations with details...');
    
    const consultations = await Consultation.find()
      .populate('studentId', 'name email school_id')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId')
      .populate('facultyId', 'name email school_id role')
      .sort('-createdAt');

    // Format the response to show relevant information
    const formattedConsultations = consultations.map(consultation => ({
      _id: consultation._id,
      section: consultation.section,
      status: consultation.status,
      student: consultation.studentId ? {
        name: consultation.studentId.name,
        school_id: consultation.studentId.school_id
      } : null,
      faculty: consultation.facultyId ? {
        name: consultation.facultyId.name,
        school_id: consultation.facultyId.school_id,
        role: consultation.facultyId.role
      } : null,
      subject: consultation.subjectId ? {
        name: consultation.subjectId.subjectName,
        code: consultation.subjectId.subjectCode
      } : null,
      schedule: consultation.scheduleId,
      createdAt: consultation.createdAt
    }));

    console.log('Found consultations:', consultations.length);
    res.json(formattedConsultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ 
      message: 'Error fetching consultations', 
      error: error.message
    });
  }
});

// Get detailed information about a specific consultation
router.get('/details/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching details for consultation:', id);

    const consultation = await Consultation.findById(id)
      .populate('studentId', 'name email school_id')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId')
      .populate('facultyId', 'name email school_id role');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // Format the response
    const formattedConsultation = {
      _id: consultation._id,
      section: consultation.section,
      status: consultation.status,
      student: consultation.studentId ? {
        name: consultation.studentId.name,
        school_id: consultation.studentId.school_id
      } : null,
      faculty: consultation.facultyId ? {
        name: consultation.facultyId.name,
        school_id: consultation.facultyId.school_id,
        role: consultation.facultyId.role
      } : null,
      subject: consultation.subjectId ? {
        name: consultation.subjectId.subjectName,
        code: consultation.subjectId.subjectCode
      } : null,
      schedule: consultation.scheduleId,
      createdAt: consultation.createdAt
    };

    console.log('Consultation details:', formattedConsultation);
    res.json(formattedConsultation);
  } catch (error) {
    console.error('Error fetching consultation details:', error);
    res.status(500).json({ 
      message: 'Error fetching consultation details', 
      error: error.message
    });
  }
});

// Modify the cleanup route to include more logging
router.delete('/cleanup-invalid', verifyToken, async (req, res) => {
  console.log('Cleanup route hit:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    user: req.user
  });

  try {
    console.log('Starting cleanup of invalid consultations...');
    console.log('User performing cleanup:', req.user);

    // First, find all consultations
    const allConsultations = await Consultation.find()
      .populate('studentId')
      .populate('facultyId')
      .populate('subjectId')
      .populate('scheduleId');

    console.log('Total consultations found:', allConsultations.length);

    // Find invalid consultations (missing references or null values)
    const invalidConsultations = allConsultations.filter(consultation => {
      const isInvalid = !consultation.studentId || 
                       !consultation.facultyId || 
                       !consultation.subjectId || 
                       !consultation.scheduleId ||
                       consultation.studentId === null ||
                       consultation.facultyId === null ||
                       consultation.subjectId === null ||
                       consultation.scheduleId === null;

      if (isInvalid) {
        console.log('Found invalid consultation:', {
          id: consultation._id,
          section: consultation.section,
          status: consultation.status,
          studentId: consultation.studentId,
          facultyId: consultation.facultyId,
          subjectId: consultation.subjectId,
          scheduleId: consultation.scheduleId
        });
      }
      
      return isInvalid;
    });

    console.log(`Found ${invalidConsultations.length} invalid consultations`);

    if (invalidConsultations.length === 0) {
      return res.json({
        message: 'No invalid consultations found',
        deletedCount: 0,
        invalidConsultations: []
      });
    }

    // Delete the invalid consultations one by one to ensure proper cleanup
    const deleteResults = await Promise.all(
      invalidConsultations.map(async (consultation) => {
        try {
          await Consultation.findByIdAndDelete(consultation._id);
          return {
            success: true,
            id: consultation._id
          };
        } catch (err) {
          console.error(`Error deleting consultation ${consultation._id}:`, err);
          return {
            success: false,
            id: consultation._id,
            error: err.message
          };
        }
      })
    );

    const successfulDeletes = deleteResults.filter(result => result.success);
    const failedDeletes = deleteResults.filter(result => !result.success);

    console.log('Cleanup results:', {
      successful: successfulDeletes.length,
      failed: failedDeletes.length
    });

    res.json({
      message: 'Cleanup completed successfully',
      deletedCount: successfulDeletes.length,
      failedCount: failedDeletes.length,
      invalidConsultations: invalidConsultations.map(c => ({
        id: c._id,
        section: c.section,
        status: c.status,
        createdAt: c.createdAt
      })),
      failedDeletes: failedDeletes
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({
      message: 'Error cleaning up invalid consultations',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update consultation purpose (for faculty)
router.put('/:consultationId/purpose', verifyToken, async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { purpose } = req.body;
    const facultyId = req.user.id;

    console.log('Updating consultation purpose:', { consultationId, purpose, facultyId });

    // Find the consultation and verify it belongs to this faculty
    const consultation = await Consultation.findOne({
      _id: consultationId,
      facultyId: facultyId
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found or you do not have permission to update it' });
    }

    // Update the purpose
    consultation.purpose = purpose;
    await consultation.save();

    // Return the updated consultation
    const updatedConsultation = await Consultation.findById(consultationId)
      .populate('facultyId', 'name email')
      .populate('studentId', 'name email program year_level section')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('scheduleId');

    console.log('Consultation purpose updated successfully');
    res.json(updatedConsultation);
  } catch (error) {
    console.error('Error updating consultation purpose:', error);
    res.status(500).json({ message: 'Error updating consultation purpose', error: error.message });
  }
});

// Get booking count for a subject
router.get('/subject/:subjectId/count', async (req, res) => {
  try {
    const { subjectId } = req.params;
    console.log('Getting booking count for subject:', subjectId);

    // Get the subject to get its schedule
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Count consultations for this subject's schedule
    const count = await Consultation.countDocuments({
      subjectId,
      'schedule.day': subject.schedule.day,
      'schedule.startTime': subject.schedule.startTime,
      'schedule.endTime': subject.schedule.endTime,
      status: { $in: ['approved', 'rejected'] } // Booked if approved or rejected
    });

    console.log('Booking count:', count);
    res.json({ count, maxSlots: 2, remainingSlots: Math.max(0, 2 - count) });
  } catch (error) {
    console.error('Error getting booking count:', error);
    res.status(500).json({ message: 'Error getting booking count', error: error.message });
  }
});

module.exports = router;
