const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectCode: {
    type: String,
    required: true,
    trim: true
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  subjectSchedule: {
    type: String,
    trim: true,
    default: ''
  },
  schedule: {
    day: {
      type: String,
      required: true,
      enum: ['M', 'T', 'W', 'Th', 'F']
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  room: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create text index for search
subjectSchema.index({
  subjectCode: 'text',
  subjectName: 'text',
  room: 'text'
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
