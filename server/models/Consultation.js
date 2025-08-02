const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  schedule: {
    day: {
      type: String,
      required: true,
      enum: ['M', 'T', 'W', 'Th', 'F', 'M & T', 'M & Th', 'M & F', 'T & Th', 'T & F', 'Th & F', 'W']
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  section: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  purpose: {
    type: String,
    default: '',
    trim: true
  },
  approvedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  },
  consultationDate: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
